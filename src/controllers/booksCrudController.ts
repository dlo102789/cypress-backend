import { Request, Response } from 'express';
import client from '../helpers/database'
import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import {Book} from '../models/Book';
const TABLE_NAME = 'cypress-books';

export default class BooksCrudController {


    static async getBook(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const result = await client.get({
                TableName: TABLE_NAME,
                Key: {
                    id: id
                }
            }).promise();

            if (!result) return res.status(401).json({success: false, message: "Book not found"});

            return res.status(200).json({success: true, content: result.Item});
        }
        catch (err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async getBooks(req: Request, res: Response) {
        try {
            const result = await client.scan({
                TableName: TABLE_NAME
            }).promise();

            if (!result) return res.status(401).json({success: false, message: "No books found."});

            return res.status(200).json({success: true, content: result.Items, count: result.Count});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async createBook(req: Request, res: Response) {
        const book: Book = {
            id: uuidv4(),
            ...req.body
        }

        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: TABLE_NAME,
            Item: book
        }

        try {
            const result = await client.put(params).promise();

            if (!result) return res.status(500).json({success: false, message: "Could not add book"});

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async updateBooks(req: Request, res: Response) {
        const id = req.body.id;
        const book = req.body;

        try {
            const idCheck = await client.get({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();

            if (!idCheck) return res.status(401).json({success: false, message: "User not found"});

            const result = await client.put({
                TableName: TABLE_NAME,
                Item: book
            }).promise();

            if (!result) return res.status(500).json({success: false, message: "Could not update book"});

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async deleteBook(req: Request, res: Response) {
        const id = req.params.id as string;

        try {
            const result = await client.delete({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();

            if (!result) return res.status(500).json({success: false, message: "Book could not be deleted"});

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }
}