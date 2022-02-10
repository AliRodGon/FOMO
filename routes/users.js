const User = require ("../models/User");
const router = require ("express").Router();

//update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash (req.body.password, salt);
            }catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body, });
            res.status(200).json("Account has been  succesfully updated")
        } catch(err) {
            return res.status(500).json(err);
        }

    }else {
        return res.status(403).json("you can update only your account")
    }
});

//delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch(err) {
            return res.status(500).json(err);
        }

    }else {
        return res.status(403).json("you can update only your account")
    }
});

//get a user

router.get("/:id", async (req,res)=> {
    try {
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other)
    }catch(err) {
        res.status(500).json(err);
    }
})

//follow a user

router.put("/:id/follow", async (req,res)=> {
    if (req.params.id !== req.body.userId) {
        
        try{
            const user = await User.findById(req.params.id); //este id es el que va en la url. por params solo llega el id, porque es lo unico que va en la url
            const userToBeFollowed = await User.findById(req.body.userId); //este es el que se pasa por body. De este se puede saber todo, porque lo localiza en la BD
            //por eso la comprobación de si el user_url ya esta siguiendo al userToBeFollowed debe hacerse chequeando los datos del userToBeFollowed. 
            //O sea: los followers del userToBeFollowed. Entonces:
          
            if(!userToBeFollowed.followers.includes(req.params.id)){ //si el user QUE SE PASA POR BODY YA TIENE entre sus followers al user de la URL
               //entonces: al user de la url se le actualiza su array de gente A LA QUE SIGUE (sus followings) y  
               await user.updateOne({$push: { followings: req.body.userId} } ) 
               // al user que se pasa por body se le actualiza su array de gente QUE LE SIGUE (sus followers)
               await userToBeFollowed.updateOne({$push: { followers: req.params.id} } ) 
               console.log(req.params.id)
               console.log(req.body.userId)
               res.status(200).json(`You are following ${userToBeFollowed.username}!!
               `)
            } else { // y si el user de la url YA TIENE 
                res.status(403).json("You already follow this user") }
        } catch (err) {
            res.status(500).json(err)
        }
    }else {
        res.status(403).json("You can't follow yourself")
    }
})



//unfollow a user

module.exports = router