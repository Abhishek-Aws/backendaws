require('dotenv').config()
// console.log("We are the environment", process.env)  // I have to remove this line after checking working of it.
const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser =   require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");


const authRoutes = require("./routes/auth")

//DB connections
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> {
    console.log("DATABASE IS CONNECTED")
}).catch("FAILED TO CONNECT PLEASE LOOK FOR POSSIBELE ERROR");

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());


// My routes
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, ()=> {
    console.log(`app is running at ${port}`);
});