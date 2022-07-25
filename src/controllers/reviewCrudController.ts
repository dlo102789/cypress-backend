import { Request, Response } from 'express';
import client from '../helpers/database'
import { v4 as uuidv4 } from 'uuid';
import { Review } from '../models/Review';

const TABLE_NAME = 'cypress-reviews';

export default class ReviewCrudController {
    static async getReviews(req: Request, res: Response) {
        try {
            const result = await client.scan({
                TableName: TABLE_NAME
            }).promise();

            if (!result)
                return res.status(400).json({success: false, message: "No reviews found"});

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async getReview(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const result = await client.get({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();

            if (!result)
                return res.status(400).json({success: false, message: "Review not found"});

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async createReview(req: Request, res: Response) {
        const d = new Date();
        try {
            const review: Review = {
                id: uuidv4(),
                dateUpdated: d.toDateString(),
                ...req.body
            };

            const result = await client.put({
                TableName: TABLE_NAME,
                Item: review
            }).promise();

            if (!result) 
                return res.status(500).json({success: false, message: "Could not create review"});

            return res.status(200).json({success: true, content: result});
            
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async updateReview(req: Request, res: Response) {
        const id: string = req.params.id;
        const d = new Date();
        const review: Review = {
            id: id,
            dateUpdated: d.toDateString(),
            ...req.body
        };

        try {
            const idCheck = await client.get({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();

            if (!idCheck) 
                return res.status(400).json({success: false, message: "Review not found"});

            const result = await client.put({
                TableName: TABLE_NAME,
                Item: review
            }).promise();

            if (!result) 
                return res.status(500).json({success: false, message: "Could not update review"});

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }

    static async deleteReview(req: Request, res: Response) {
        const id = req.params.id;

        try {
            const result = await client.delete({
                TableName: TABLE_NAME,
                Key: {
                    id
                }
            }).promise();

            if (!result) 
                return res.status(400).json({success: false, message: "Could not delete review"});

            return res.status(200).json({success: true, content: result});
        }
        catch(err) {
            return res.status(500).json({success: false, message: err});
        }
    }
}