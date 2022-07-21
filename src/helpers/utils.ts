import { pbkdf2, randomBytes } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import {User} from '../models/User';
import fs from 'fs';
import path from 'path';
import {BinaryLike} from 'crypto';
import {SaltHash} from '../models/SaltHash'


const PRIV_KEY = fs.readFileSync(path.join(__dirname, '../../keys/id_rsa_priv.pem'), 'utf8');

export const validatePassword = (password: string, hash: string, salt: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const passConvert = password as BinaryLike;
        const saltConvert = salt as BinaryLike;
        pbkdf2(passConvert, saltConvert, 10000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(hash === derivedKey.toString('hex'));
            }
        })
    })
    
}

export const genPassword = (password: string) => {
    console.log("start genPassword");
    return new Promise<SaltHash>((resolve, reject) => {
        const salt = randomBytes(32).toString('hex');
        console.log("creating salt");
        pbkdf2(password, salt, 10000, 64, 'sha512', (err, derivedKey) => {
            console.log("generated password");
            if (err)
                reject(err.message);
            else {
                const key: SaltHash = {
                    salt: salt,
                    hash: derivedKey.toString('hex')
                };

                resolve(key);
            }
                 
        })
    })
    
}

export const issueJWT = (user: User) => {
    
    const id = user.id;
    const expiresIn = '7d';

    const payload = {
        sub: id,
        iat: Date.now()
    };

    const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
        expiresIn: expiresIn,
        algorithm: "RS256"
    });

    return {
        token: "Bearer " + signedToken,
        expires: expiresIn
    }
}