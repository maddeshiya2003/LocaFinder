const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// reviews route to add review by post method 
// 1 to many relation hai ye
// add new review
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.distroyReview));

module.exports = router;