const express = require("express");
const app = express();
const mongoose = require ("mongoose");
const dotenv = require ("dotenv");
const helmet = require ("helmet");
const morgan = require ("morgan");
const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth.js");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlPArser: true}, ()=> {
console.log("Connection to MONGO is OK!")

});

//middlewares

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);


app.listen(5000,()=>{
    console.log("Server running on port 5000")
})