const router = require("express").Router()
const pool = require("../db");

//USERS
router.post("/buyproduct", async (req, res) => {
    try {
        const { farm_id, products, quantities, user_id,username,email,phone_number } = req.body;

        // Validate the input
        if (!farm_id || !user_id || !Array.isArray(products) || !Array.isArray(quantities) || products.length !== quantities.length) {
            return res.status(400).json({ error: 'Invalid input' });
        }

        // Calculate the total amount
        let totalAmount = 0;

        for (let i = 0; i < products.length; i++) {
            const productId = products[i];
            const quantity = quantities[i];

            // Fetch the price of the product from the database
            const result = await pool.query("SELECT price FROM products WHERE id = $1", [productId]);
            const product = result.rows[0];

            if (!product) {
                return res.status(400).json({ error: `Product with id ${productId} not found` });
            }

            totalAmount += product.price * quantity;
        }

        const result = await pool.query(
            "INSERT INTO buy (farm_id, user_id, products, quantities, totalamount, username, email, phone_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
            [farm_id, user_id, products, quantities, totalAmount, username, email, phone_number]
        );

        const orderId = result.rows[0].id;

        res.status(200).json({ success: true, orderId });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//USERS

router.get("/getbuyers", async (req, res) => {
    try {
        const { farm_id } = req.query;
        if (!farm_id) {
            return res.status(400).json({ error: 'farm_id is required' });
        }


        const userProductsQuery = `
        SELECT 
            u.username,
            u.phone_number,
            u.email,
            b.totalamount,
            json_agg(json_build_object(
                'product_id', p.id,
                'name', p.name,
                'price', p.price,
                'quantity', q.quantity
            )) AS products
        FROM 
            buy b
        JOIN 
            unnest(b.products, b.quantities) WITH ORDINALITY as q(product_id, quantity, ord)
        ON 
            q.product_id = ANY(b.products)
        JOIN 
            products p
        ON 
            p.id = q.product_id
        JOIN
            users u
        ON
            b.user_id = u.id
        WHERE 
            b.farm_id = $1
        GROUP BY 
            u.username, u.phone_number, u.email, b.totalamount;`
        
        const userProductsResult = await pool.query(userProductsQuery, [farm_id]);

        // Send the fetched data as a response
        res.json({ buyers: userProductsResult.rows });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



//users buyedproducts

router.get("/productinfo", async (req,res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'farm_id is required' });
        }


        const userProductsQuery = `
        SELECT 
            u.username,
            u.phone_number,
            u.email,
            b.totalamount,
            json_agg(json_build_object(
                'product_id', p.id,
                'name', p.name,
                'price', p.price,
                'quantity', q.quantity
            )) AS products
        FROM 
            buy b
        JOIN 
            unnest(b.products, b.quantities) WITH ORDINALITY as q(product_id, quantity, ord)
        ON 
            q.product_id = ANY(b.products)
        JOIN 
            products p
        ON 
            p.id = q.product_id
        JOIN
            users u
        ON
            b.user_id = u.id
        WHERE 
            b.user_id = $1
        GROUP BY 
            u.username, u.phone_number, u.email, b.totalamount;`
        
        const userProductsResult = await pool.query(userProductsQuery, [user_id]);

        // Send the fetched data as a response
        res.json({ products: userProductsResult.rows });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post("/reducequantity",async (req,res) => {
    const {product_id,quantity} = req.body;
    await pool.query("")
})
//FARM
// router.get("/getbuyers", async (req,res) => {
//     try {
//         const {farm_id} = req.query;
//         const buyers = await pool.query("SELECT * from buy WHERE farm_id = $1",[farm_id]);
//         res.status(200).json({buyers: buyers.rows});
//         //user_id,product_id,farm_id
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

// router.get("/getbuyers", async (req, res) => {
//     try {
//         const { farm_id } = req.body;

//         const query = `
//             SELECT 
//                 u.username,
//                 u.email,
//                 b.products,
//                 b.quantities,
//                 SUM(p.price * b.quantities[idx]) AS totalamount
//             FROM 
//                 buy b
//             JOIN 
//                 users u ON b.user_id = u.id
//             JOIN 
//                 unnest(b.products) WITH ORDINALITY AS prod (product_id, idx) ON TRUE
//             JOIN 
//                 products p ON p.id = prod.product_id
//             WHERE 
//                 b.farm_id = $1
//             GROUP BY 
//                 u.id, b.products, b.quantities
//         `;

//         const buyers = await pool.query(query, [farm_id]);

//         res.status(200).json({ buyers: buyers.rows });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


router.get("/getproducts",async (req,res) => {
    try {
        const {farm_id} = req.query;
        const products = await pool.query("SELECT * from products WHERE farm_id =$1",[farm_id]);
        res.json({products: products.rows})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router



// CREATE TABLE public.buy (
//     id SERIAL PRIMARY KEY,
//     farm_id INTEGER REFERENCES public.farms(id),
//     product_id INTEGER REFERENCES public.products(id),
//     user_id INTEGER REFERENCES public.users(id)
// );