import { Request, Response } from "express";
import client from "../helpers/database";
import { DynamoDB } from "aws-sdk";
import { validatePassword, genPassword, issueJWT } from "../helpers/utils";
import { User } from "../models/User";
import { v4 as uuidv4 } from "uuid";

export default class ValidateController {
    
}