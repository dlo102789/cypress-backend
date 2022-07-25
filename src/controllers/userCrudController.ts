import { Request, Response } from 'express';
import client from '../helpers/database'
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';
import { Book } from '../models/Book';

const TABLE_NAME = 'cypress-users';

export default class UserCrudController {

    static async getUsers(req: Request, res: Response) {
        const params: DynamoDB.DocumentClient.ScanInput = {
            TableName: TABLE_NAME 
        }
 
        const data = await client.scan(params).promise();

        if (!data) 
            res.status(500).json({success: false, message: 'Users not found.'});

        return res.status(200).json({success: true, content: data});
    }

    static async getUser(req: Request, res: Response) {
        const id = req.params.id;
        const params: DynamoDB.DocumentClient.GetItemInput = {
            TableName: TABLE_NAME,
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
        const user: User = {
            id: uuidv4(),
            books: [],
            ...req.body
        }
        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: TABLE_NAME,
            Item: user,
            ConditionExpression: 'attribute_not_exists(id)'
        }

        try {
            const data = await client.put(params).promise();

            if (!data) {
                return res.status(500).json({success: false, message: "User could not be created"});
            }

            return res.status(200).json({success: true, content: data});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
        
    }

    static async updateUser(req: Request, res: Response) {
        const id = req.body.id;
        const user = req.body;

        try {
            const idCheck = await client.get({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();
    
            if (!idCheck) {
                return res.status(500).json({success: false, message: "user does not exist"});
            }
    
            const data = await client.put({
                TableName: TABLE_NAME,
                Item: {
                    user
                }
            }).promise();
    
            if (!data) {
                return res.status(500).json({success: false, message: "Could not update user"});
            }
    
            return res.status(200).json({success: true, content: data});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
        
    }

    static async deleteUser(req: Request, res: Response) {
        const id = req.params.id;

        const data = await client.delete({
            TableName: TABLE_NAME,
            Key: {
                id
            }
        }).promise();

        if (!data) {
            return res.status(500).json({success: false, message: "Could not delete user."});
        }

        return res.status(200).json({success: true, content: data});
    }

    static async addBook(req: Request, res: Response) {
        const book: Book = req.body.book;
        const id = req.body.id;

        try {
            const userResult = await client.get({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();

            const user = userResult.Item as User;
            
            user.books.push(book);

            const result = await client.put({
                TableName: TABLE_NAME,
                Item: user
            }).promise();

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async updateBooks(req: Request, res: Response) {
        const id = req.body.id;
        const books = req.body.books;

        try {
            const userResult = await client.get({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();

            const user = userResult.Item as User;

            user.books = books;

            const result = await client.put({
                TableName: TABLE_NAME,
                Item: user
            }).promise();

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async deleteBook(req: Request, res: Response) {
        const id = req.body.id;
        const book = req.body.book;

        try {
            const userResult = await client.get({
                TableName: TABLE_NAME,
                Key: id
            }).promise();

            const user = userResult.Item as User;

            if (!(book in user.books))
                return res.status(401).json({success: false, message: "Book not found."});

            user.books = user.books.filter(element => element != book);

            const result = await client.put({
                TableName: TABLE_NAME,
                Item: user
            }).promise();

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }
}