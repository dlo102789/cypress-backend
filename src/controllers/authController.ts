import { Request, Response } from "express";
import client from "../helpers/database";
import { DynamoDB } from "aws-sdk";
import { validatePassword, genPassword, issueJWT } from "../helpers/utils";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";

export default class authController {
  static async register(req: Request, res: Response) {
    try {
      const { hash, salt } = await genPassword(req.body.password as string);
      const user = {
        id: uuidv4(),
        userId: req.body.userId as string,
        firstName: req.body.firstName as string,
        lastName: req.body.lastName as string,
        email: req.body.email as string,
        isAdmin: false,
        hash: hash,
        salt: salt,
        books: []
      };

      const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: "cypress-users",
        Item: user,
        ConditionExpression: "attribute_not_exists(id)",
      };
      const result = await client.put(params).promise();
      if (!result) {
        return res
          .status(500)
          .json({ success: false, message: "Unable to create user" });
      } else {
        const jwt = issueJWT(user);
        return res.status(200).json({
          success: true,
          user: user.id,
          token: jwt.token,
          expiresIn: jwt.expires,
        });
      }
    } catch (err) {
      if (err == "ERR_INVALID_ARG_TYPE")
        return res
          .status(500)
          .json({
            success: false,
            message: "ERR_INVALID_ARG_TYPE: Check request body",
          });
      return res.status(500).json({ success: false, message: err });
    }
  }

  static async login(req: Request, res: Response) {
    const userId = req.body.userId as string;
    const password = req.body.password as string;

    const params: DynamoDB.DocumentClient.ScanInput = {
      TableName : 'cypress-users',
      FilterExpression : 'userId = :user_id',
      ExpressionAttributeValues : {':user_id' : userId}
    };

    try {
      const result = await client.scan(params).promise();

      if (!result) {
        return res
          .status(401)
          .json({ success: false, message: "Could not find user." });
      }

      const user = result.Items?.pop() as User;
      
      const isValid = await validatePassword(password, user.hash, user.salt);
      if (isValid) {
        const token = issueJWT(user);
        return res.status(200).json({
          success: true,
          user: user,
          token: token.token,
          expiresIn: token.expires,
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password." });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  }
}
