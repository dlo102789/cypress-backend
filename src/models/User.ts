import { Book } from "./Book";

export class User {
    public id!: string;
    public userId: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public hash: string;
    public salt: string;
    public isAdmin: boolean;
    public books: Book[];
}