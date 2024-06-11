// Import dotenv and call the config method
const loadconfig = require('dotenv').config;

loadconfig({
    path: '.env'
});


const config = {
    PORT: parseInt(process.env.PORT) || 3001,
    AWS: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
        BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        REGION: 'us-east-1'
    }
};

// Export the config object
module.exports = config;
