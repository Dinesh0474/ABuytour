const { PutObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config/index');

const s3Client = new S3Client({
    region: config.AWS.REGION,
    credentials: {
        accessKeyId: config.AWS.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.AWS.AWS_SECRET_KEY
    }
});

const BUCKET_NAME = config.AWS.BUCKET_NAME;

async function createSignedPost({ Key, ContentType }) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: Key,
        ContentType: ContentType
    });

    const fileLink = `https://${BUCKET_NAME}.s3.${config.AWS.REGION}.amazonaws.com/${Key}`;

    const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 5 * 60
    });

    return { signedUrl, fileLink };
}

module.exports = { createSignedPost };
