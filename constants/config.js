require('dotenv').config();

const PORT = process.env.PORT || 5000;

module.exports = {
    PORT,
    DB: process.env.DB_URL || 'mongodb://localhost:27017/users',

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access_key',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh_key',
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET || 'resetSecret',

    MAIL_USER: process.env.MAIL_USER || '12@gmail.com',
    MAIL_PASS: process.env.MAIL_PASS || '1nnk5',

    AWS_ID: process.env.AWS_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_AVATAR_ACL: 'public-read',

    APP_URL: process.env.APP_URL || 'http://localhost:3000',
    SERVER_URL: process.env.SERVER_URL || `http://localhost:${PORT}`,

    IMAGE_MAX_SIZE: 3 * 1024 * 1024,
    DOCUMENT_MAX_SIZE: 6 * 1024 * 1024,
    VIDEO_MAX_SIZE: 20 * 1024 * 1024,
    AUDIO_MAX_SIZE: 8 * 1024 * 1024,
    MAX_AVATAR_UPLOAD_COUNT: 5,

    STATIC: 'static'
}