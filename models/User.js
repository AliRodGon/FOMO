const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    lifeEvent: {
        type: String,
        required: true,
        max: 200,

    },
    password: {
        type: String,
        required: true,
        min:6
    }
    // happinessRecipe: {
    //     read: {
    //         type: String,
    //         max: 50,
    //     },
    //     listen: {
    //         type: String,
    //         max: 50
    //     },
    //     watch: {
    //         type: String,
    //         max: 50
    //     }
    // },
    // followers: {
    //     type: Array,
    //     default:[]
    // },
    // followins: {
    //     type: Array,
    //     default:[]
    // },
// },
// {timestamps: true}
});

module.exports = mongoose.model("User", UserSchema)