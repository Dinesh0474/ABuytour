const express = require("express")
const { createSignedPost } = require('../utils/s3');

const s3Router = express.Router();

s3Router.post('/signed_url', async (req,res) => {
    try {
        const {key,content_type} = req.body;
        const {signedUrl,fileLink} = await  createSignedPost({
            Key : key,
            contentType: content_type
        }) 
        return res.send({
            data:{
                signedUrl,
                fileLink
            }
        })
    } catch (error) {
        console.error(error)

        return res.status(500).send({
            error: error.message
        });
    }
})


module.exports = s3Router;