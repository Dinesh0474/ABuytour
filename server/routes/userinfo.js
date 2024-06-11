const router = require("express").Router();
const pool = require("../db")

router.get("/userinfo", async (req, res) => {
    try {
        const { user_id } = req.query; // Extract user_id from the request body
        console.log(user_id)
        const user = await pool.query(
            "SELECT username, email, phone_number FROM users WHERE id = $1",
            [user_id]
        );
        res.status(200).json({
            username: user.rows[0].username,
            email: user.rows[0].email,
            phone_number: user.rows[0].phone_number
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get("/bookinginfo", async (req,res) => {
    try {
        const {user_id} = req.query;
        const bookingdetails = await pool.query("SELECT * from bookings where user_id =$1",[user_id])
        res.json({success:true ,booking:bookingdetails.rows});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;