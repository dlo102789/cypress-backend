import AuthCrudController from '../controllers/authController';
import express from 'express';
import request from 'supertest';
import { genPassword } from '../helpers/utils';

const app = express();

app.use(express.urlencoded({extended: false}));
app.post("/register", AuthCrudController.register);
app.post("/login", AuthCrudController.login);

describe('Auth Controller', () => {

    // describe('Register method', () => {
    //     it('Should create a new User model and upload to cypress-users', async () => {
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         const registerResponse: any = await request(app)
    //         .post("/register")
    //         .type("form")
    //         .send({
    //             userId: "test",
    //             password: "testpassword123",
    //             firstName: "firstname",
    //             lastName: "lastname",
    //             email: "testemail@test.com"
    //         });

    //         console.log(registerResponse);

    //         expect(registerResponse.status).toBe(200);
    //         expect(registerResponse.success).toBe(true);
    //         expect(registerResponse.token).toBeDefined();
    //         expect(registerResponse.user).toBeDefined();

    //         const id = registerResponse.user;
    //         await client.delete({
    //             TableName: 'cypress-users',
    //             Key: {
    //                 id
    //             }
    //         })
    //     });
    //});

    describe("Login method", () => {
        it("Should login and provide token", async () => {
            const {salt, hash} = await genPassword("testpassword123");
            const user = {
                id: '52d14b02-acc9-4791-a4bc-b65c7eacc2bf',
                userId: "test",
                firstName: "firstname",
                lastName: "lastname",
                email: "testemail@test.com",
                isAdmin: true,
                salt: salt,
                hash: hash
            };
            
            await request(app)
            .post("/login")
            .type("form")
            .send({
                userId: "test",
                password: "testpassword123" 
            })
            .then(response => {
                console.log(response.status);
                console.log(response.body);
                expect(response.status).toBe(200);
                expect(response.body.success).toBe(true);
                expect(response.body.user).toBeDefined();
                expect(response.body.token).toBeDefined();
                expect(response.body.user.id).toBe(user.id);
            })

        })
    })
})