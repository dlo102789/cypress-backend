import AWS from 'aws-sdk';
import config from '../config';

//create new DynamoDB client & update region
AWS.config.update(config.aws_remote_config);
const client = new AWS.DynamoDB.DocumentClient();

export default client;