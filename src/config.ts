import 'dotenv/config'

const config = {
  aws_remote_config: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  },
};

export default config;