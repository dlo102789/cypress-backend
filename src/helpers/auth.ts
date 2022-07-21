import fs from "fs";
import { Strategy, ExtractJwt, } from "passport-jwt";
import { PassportStatic } from "passport";
import {} from "passport";
import client from '../helpers/database'
import { DynamoDB } from "aws-sdk";


const PUB_KEY = fs.readFileSync("../../keys/id_rsa_pub.pem", "utf8");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

const strategy = new Strategy(options, async (payload, done) => {
    const id = payload.sub;
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'cypress-users',
        Key: {
            id
        }
    }

    try {
        const data = await client.get(params).promise();

        if (!data) {
            done(null, false);
        }
        else {
            done(null, data);
        }
    }
    catch(e) {
        done(e, null);
    }

})

export default function(passport: PassportStatic) {
    passport.use(strategy);

}