let Listing = require("./models/listing");
let Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");


// kya user hamara login hai ya nahi  
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to created listing")
        res.redirect("/login");
    }
    next();
}

// agar user login nahi hai toh ye check karne ke liye ki
// jo route se request aa rha hai us hi route pe redirect karwao
// exaamle => add new listing ke agar login nahi hai toh hme login check karne aur login karne ke baad hame add new listing  pe hi jana hai 
module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// check karne ke liye ki koon onwer hai listing ka
module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params; 
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// validate listing schema on server side
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((elem) => elem.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400 , errMsg);
    } else {
        next();
    }
}

// validate review schema on server side
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((elem) => elem.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400 , errMsg);
    } else {
        next();
        
    }
}

// check karne ke liye ki koon author hai review ka
module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params; 
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
