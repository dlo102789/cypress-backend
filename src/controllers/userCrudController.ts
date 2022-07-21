import { Request, Response } from 'express';
import client from '../helpers/database'
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export default class UserCrudController {

    static async getUsers(req: Request, res: Response) {
        const params: DynamoDB.DocumentClient.ScanInput = {
            TableName: 'cypress-users' 
        }
 
        const data = await client.scan(params).promise();

        if (!data) 
            res.status(500).json({success: false, message: 'Users not found.'});

        return res.status(200).json({success: true, content: data});
    }

    static async getUser(req: Request, res: Response) {
        const id = req.params.id;
        const params: DynamoDB.DocumentClient.GetItemInput = {
            TableName: 'cypress-users',
            Key: {
                id
            }
        }

        const data = await client.get(params).promise();

        if (!data) {
            return res.status(500).json({success: false, message: "ID not found."});
        }

        return res.status(200).json({success: true, content: data});
    }

    static async createUser(req: Request, res: Response) {
        const user = {
            id: uuidv4(),
            ...req.body
        }
        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'cypress-users',
            Item: user,
            ConditionExpression: 'attribute_not_exists(id)'
        }

        const data = await client.put(params).promise();

        if (!data) {
            return res.status(500).json({success: false, message: "User could not be created"});
        }

        return res.status(200).json({success: true, content: data});
    }

    static async updateUser(req: Request, res: Response) {
        const id = req.body.id;
        const user = req.body;
        const idCheck = await client.get({
            TableName: 'cypress-users',
            Key: {
                id
            }
        }).promise();

        if (!idCheck) {
            return res.status(500).json({success: false, message: "user does not exist"});
        }

        const data = await client.put({
            TableName: 'cypress-users',
            Item: {
                user
            }
        }).promise();

        if (!data) {
            return res.status(500).json({success: false, message: "Could not update user"});
        }

        return res.status(200).json({success: true, content: data});
    }

    static async deleteUser(req: Request, res: Response) {
        const id = req.params.id;

        const data = await client.delete({
            TableName: 'cypress-users',
            Key: {
                id
            }
        }).promise();

        if (!data) {
            return res.status(500).json({success: false, message: "Could not delete user."});
        }

        return res.status(200).json({success: true, content: data});
    }
}