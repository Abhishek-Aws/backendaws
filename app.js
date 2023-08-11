require('dotenv').config()
// console.log("We are the environment", process.env)  // I have to remove this line after checking working of it.
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser =   require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

//DB connections
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> {
    console.log("DATABASE IS CONNECTED");
}).catch("FAILED TO CONNECT PLEASE LOOK FOR POSSIBELE ERROR");

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());


// My routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port, ()=> {
    console.log(`app is running at ${port}`);
});