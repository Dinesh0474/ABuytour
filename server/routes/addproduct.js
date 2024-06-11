const router = require("express").Router();
const pool = require("../db");


//addproduct
//showproduct
//farm

router.post("/addproduct",async (req,res) =>{
    try{
    const {name,farm_id,type,availability,price,seasonality,description} = req.body;
    const newProducts = await pool.query("INSERT INTO products (farm_id,name,type,availability,price,seasonality,description) VALUES($1,$2,$3,$4,$5,$6,$7) ",[farm_id,name,type,availability,price,seasonality,description])
    res.status(200).json({ success: true });
} catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
    
}})

router.get("/showproduct",async (req,res) => {
    try {
        const {farm_id} = req.query;
        const products = await pool.query("SELECT * from products where farm_id = $1",[farm_id]);
        res.status(200).json({products: products.rows})
    } catch (error) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


// CREATE TABLE public.products (
//     id SERIAL PRIMARY KEY,
//     farm_id INTEGER REFERENCES public.farms(id),
//     name VARCHAR(255),
//     type VARCHAR(255),
//     availability BOOLEAN,
//     price DECIMAL(10, 2),
//     seasonality TEXT,
//     description TEXT
// );

module.exports = router;