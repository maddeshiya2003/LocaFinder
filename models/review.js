const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment:String,
    rating: {
        type:Number,
        min:1,
        max:5
    },
    cretedAt:{
        type:Date,
        default:Date.now()
    },
    author : {
        type:Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review",reviewSchema);

// --------------------------------------------------------------------------
// ye one to many relationship hai 
// 1 listing ke sath many relationship hai
// --------------------------------------------------------------------------