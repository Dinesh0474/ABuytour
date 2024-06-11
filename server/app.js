const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const config = require("./config/index")
const s3Router = require("./routes/s3")
app.use(express.json());
app.use(cors());


app.use("/auth",require("./routes/jwtAuth"))

app.use("/dash",require("./routes/dashboard"))

app.use("/farm",require("./routes/addproduct"))

app.use("/farm",require("./routes/slots"));

app.use("/farm",require("./routes/farminfo"))

app.use("/farm",require("./routes/buyproducts"))

app.use("/user",require("./routes/userinfo"))

app.use("/api/s3",s3Router)

app.listen(config.PORT,async (req,res) =>{
    console.log(`Server running on port ${config.PORT}`);
})