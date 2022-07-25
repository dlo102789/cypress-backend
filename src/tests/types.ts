import { Response } from 'supertest';
import { User } from '../models/User';

export interface IAuthRegisterResponse extends Response {
    success: boolean;
    token: string;
    user: string;
}

export interface IAuthLoginResponse extends Response {
    success: boolean;
    token: string;
    user: User;
}