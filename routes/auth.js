const router = require ("express").Router();
const User= require("../models/User")


//REGISTER
router.get("/register", async (req,res)=>{
    const user = await new User({
        username: "alison",
        email: "alison@gmail.com",
        lifeEvent: "first breakheart",
        password: "123456"
    })

    await user.save();
    res.send("funcionó!")
});
module.exports = router;