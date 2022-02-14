const router = require("express").Router();
const Post = require ("../models/Posts");
const User = require("../models/User");

//create post

router.post("/", async(req,res)=>{
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json("Your post has been published!")
    }catch{
        res.status(500).json(err)
    }

})

//update post

router.put("/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId == req.body.userId) {
            await post.updateOne({$set:req.body});
            res.status(200).json("Your post has been updated")

        }else{
            res.status(403).json("you can only update your own user's posts")
        }
    }catch {
        res.status(500).json(err);
    }
})

//delete post

router.delete("/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if(post.userId == req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Your post has been deleted")

        }else{
            res.status(403).json("you can only delete your own user's posts")
        }
    }catch {
        res.status(500).json(err);
    }
})

//like a post

router.put("/:id/like", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id); //primero le llega el post por params (id en la url)
        console.log(post)
        if(!post.likes.includes (req.body.userId)){
//si en el aray de likes del post NO ESTA el userId del user que se le pasa por body, se mete el id del user en el array de likes del post
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("You liked this post")

        }else{
            await post.updateOne({$pull: {likes: req.body.userId}})
            res.status(200).json("You stopped liking this post")
        }
    }catch {
        res.status(500).json(err);
    }
})


//hate a post
router.put("/:id/dislike", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id); 
        console.log(post)
        if(!post.dislikes.includes (req.body.userId)){

            await post.updateOne({$push: {dislikes: req.body.userId}});
            res.status(200).json("You disliked this post")

        }else{
            await post.updateOne({$pull: {dislikes: req.body.userId}})
            res.status(200).json("You stopped disliking this post")
        }
    }catch {
        res.status(500).json(err);
    }
})

//get a post
router.get ("/:id", async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
    }catch{
        res.status(400).json(err)
    }
})

//get all posts

router.get("/timeline/:userId", async (req, res) => {
    try {
      const currentUser = await User.findById(req.params.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      res.status(500).json(err);
    }
  });

  // get all posts from a user

router.get("/profile/:username", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const posts = await Post.find({ userId: user._id });
      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json(err);
    }
  });

    
    

   



module.exports = router;