import { Request, Response } from 'express';
import { combineTableNames } from 'sequelize/types/utils';
import client from '../helpers/database'

export default class UserCrudController {

    static async getUsers(req: Request, res: Response) {
        console.log("calling GET users");
        const params = {
            TableName: 'cypress-users'
        }

        const data = await client.scan(params).promise;

        if (!data) 
            res.status(500).json({status: 'error', message: 'Users not found.'});

        return res.status(200).json(data);
    }
}