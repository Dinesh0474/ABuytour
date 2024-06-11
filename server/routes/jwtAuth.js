const router = require("express").Router();

const pool = require("../db")

const bcrypt = require("bcrypt")

const jwtGenerator= require('../utils/jwtGenerator')

const validInfo = require("../middleware/validInfo")

const authorization = require("../middleware/authorization")

router.post("/register",validInfo ,async(req,res) => {
    try {

        const {name,email,password,phone_number} = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

       

        if(user.rows.length !== 0){
            return res.status(401).json("user already exists")  
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)

        const bcryptPassword = await bcrypt.hash(password,salt)
        

        const newUser = await pool.query("INSERT INTO users (username,email,password_hash,phone_number) VALUES ($1,$2,$3,$4) RETURNING *",[name,email,bcryptPassword,phone_number])
        
        
        const user_id = newUser.rows[0].id;
        const token = jwtGenerator(user_id);
        
        res.json({token});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})


router.post("/login",validInfo,async (req,res) => {
    try {
        const {email,name,password} = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1",[email]);

        if(user.rows.length === 0){
            res.status(401).send("Password or Email is incorrect")
        };

        const validPassword = await  bcrypt.compare(password,user.rows[0].password_hash);

        if(!validPassword){
            return res.status(401).json("Email or Password is Incorrect")
        }

        const token = jwtGenerator(user.rows[0].id);

        res.json({token, id : user.rows[0].id })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})

router.get("/is-verify",authorization,async (req,res) => {
    try {
        res.json(true);
        console.log("yes");
;    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})

router.post("/Farmregister",validInfo ,async(req,res) => {
    try {

        const {name,email,password,phone_number} = req.body;

        const user = await pool.query("SELECT * FROM farms WHERE email = $1", [email]);

       

        if(user.rows.length !== 0){
            return res.status(401).json("user already exists")  
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)

        const bcryptPassword = await bcrypt.hash(password,salt)
        

        const newUser = await pool.query("INSERT INTO farms (name,email,password,phone_number) VALUES ($1,$2,$3,$4) RETURNING *",[name,email,bcryptPassword,phone_number])
        
        
        const user_id = newUser.rows[0].id;
        const token = jwtGenerator(user_id);
        
        res.json({token});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})

router.post("/Farmlogin",validInfo,async (req,res) => {
    try {
        const {email,name,password} = req.body;

        const user = await pool.query("SELECT * FROM farms WHERE email = $1",[email]);

        if(user.rows.length === 0){
            res.status(401).send("Password or Email is incorrect")
        };

        const validPassword = await  bcrypt.compare(password,user.rows[0].password);

        if(!validPassword){
            return res.status(401).json("Email or Password is Incorrect")
        }

        const token = jwtGenerator(user.rows[0].id);

        res.json({token,id:user.rows[0].id})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
})

module.exports = router;