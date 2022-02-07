const router = require ("express").Router();

router.get("/", (req,res)=>{
    res.send("Hola! esto es userRoutes")
})
module.exports = router