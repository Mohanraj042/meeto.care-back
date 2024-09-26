import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

export const ENVIRONMENT = process.env.NODE_ENV;

switch (ENVIRONMENT) {
    case 'production': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.production'))) {
            dotenv.config({ path: ".env.production" });
        } else {
            process.exit(1);
        }
        break;
    }
    case 'development': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.development'))) {
            dotenv.config({ path: ".env.development" });  
        } else {
            process.exit(1);
        }
        break;
    }
    case 'testing': {
        if (fs.existsSync(path.join(process.cwd(), '/.env.testing'))) {
            dotenv.config({ path: ".env.testing" });
        } else {
            process.exit(1);
        }
        break;
    }
    default: {
        if (fs.existsSync(path.join(process.cwd(), '/.env.development'))) {
            dotenv.config({ path: ".env.development" });
        } else {
            process.exit(1);
        }

    }
}

export const SERVER = {
    APP_NAME: 'Upturn',
    PORT: process.env['PORT'],
    MONGODB_URL: process.env['MONGODB_URL'] || '',
    CREDENTIALS: process.env['MONGODB_URL'] || '',
    MONGODB_USER: process.env['MONGODB_USER'],
    MONGODB_PASSWORD: process.env['MONGODB_PASSWORD'],
    BASE_URL: process.env['BaseURL'],
    TOKEN_EXPIRATION_IN_MINUTES: 259200000,
    JWT_SECRET_KEY: process.env['jwtSecretKey'],
    COUNTRY_CODE: '+91',
    MAX_DISTANCE_RADIUS_TO_SEARCH: '1',
    THUMB_WIDTH: 300,
    THUMB_HEIGHT: 300,
    EMAIL_HOST: process.env['EMAIL_HOST'],
    EMAIL_PORT:process.env['EMAIL_PORT'],
    EMAIL_USER:process.env['EMAIL_USER'],
    EMAIL_PASS:process.env['EMAIL_PASS'],
    EMAIL_CODE:process.env['EMAIL_CODE'],
    SMS_API_KEY:process.env['API_KEY'],
    SMS_SENDER_ID:process.env['SENDER_ID'],
    SMS_ROUTE_NO:process.env['ROUTE_NO'],
    SMS_CODE:process.env['SMS_CODE'],
    PAYMENT_TYPE:process.env['PAYMENT_TYPE'],
    BASIC_AUTH_USER: process.env['basicAuthUser'],
    BASIC_AUTH_PWD: process.env['basicAuthKey'],
    SENDGRID_API_KEY: process.env['sendGridApiKey'],
    DOMAIN_NAME: process.env['DOMAIN_NAME'],
    ADMIN_DOMAIN: process.env['ADMIN_DOMAIN'],
    SNS_ACCESS_KEY: process.env['SNS_KEY'],
    SNS_SECRET_KEY: process.env['SNS_SECRET'],
    SNS_MSG_ACCESS_KEY: process.env['SNS_MSG_ACCESS_KEY'],
    SNS_MSG_SECRET_KEY: process.env['SNS_MSG_SECRET_KEY'],
    SES_ACCESS_KEY: '',
    SES_SECRET_KEY: '',
    SALT: '',
    CIPER: '',
    AWS_ACCESS_KEY: process.env['AWS_ACCESS_KEY'],
    AWS_SECRET_KEY: process.env['AWS_SECRET_KEY'],
    AWS_REGION: '',
    SNS_REGION: process.env['SNS_REGION'],
    AWS_BUCKET: process.env['S3_BUCKET'],
    S3_URL: process.env['S3_BASE_URL'],
    CRYPTO_ALGO: 'aes-128-ctr',
    CRYPTO_KEY: 'test',
    FCM_KEY: '',
};
