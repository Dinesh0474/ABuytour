const express = require('express');
const multer = require('multer');
const pool = require('../db'); // Adjust the path as necessary
const router = express.Router();

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/updateProfile", upload.single('videoFile'), async (req, res) => {
    try {
        const { farm_id, location, description, video } = req.body;

        // Ensure all required fields are present
        if (!farm_id || !location || !description || !video) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        console.log('Request Body:', req.body);
        if (req.file) {
            console.log('File Details:', req.file);
        }

        // Update the database with the new profile information
        await pool.query(
            "UPDATE farms SET location=$1, description=$2, video=$3 WHERE id=$4",
            [location, description, video, farm_id]
        );

        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/getfarminfo", async (req,res) => {
    try {
        const farms = await pool.query("SELECT * from farms");
        res.status(200).json({farms : farms.rows})
    } catch (error) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get("/finfo", async (req,res) => {
    try {
        const {email} = req.query;
        console.log(email);
        const farm = await  pool.query("SELECT * from farms where email = $1",[email]);
        console.log(farm.rows)
        res.status(200).json({ farms: farm.rows,farm_id : farm.rows[0].id})
    } catch (error) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.get("/profile", async (req,res) => {
    try {
        const {farm_id} = req.query;
        const farm = await  pool.query("SELECT * from farms where id = $1",[farm_id]);

        res.status(200).json({ farms: farm.rows})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post("/productremove", async (req,res) => {
    try{
        const {id} = req.body;
         await pool.query("DELETE * from products where id = $1",id);
        res.status(200).json({message: success});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

router.post("/slotremove", async (req,res) => {
    try{
        const {id} = req.body;
         await pool.query("DELETE * from slots where id = $1",id);
        res.status(200).json({message: success});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router