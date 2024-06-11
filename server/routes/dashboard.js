const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization")

router.get("/",authorization, async (req,res) => {
    try {

        const user = await pool.query("SELECT * FROM users WHERE id = $1",[req.user])
        res.json(user.rows[0]);

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})

router.get("/farm",authorization, async (req,res) => {
    try {

        const user = await pool.query("SELECT * FROM farms WHERE id = $1",[req.user])
        res.json(user.rows[0]);

        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})


module.exports = router