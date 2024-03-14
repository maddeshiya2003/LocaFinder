const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")
    // index route
    .get(wrapAsync(ListingController.index))
    // Create Route 
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.createListing));


// new route
router.get("/new", isLoggedIn, ListingController.renderNewForm);


router.route("/:id")
    // show route 
    .get(wrapAsync(ListingController.showListing))
    // update route 
    .put(isLoggedIn, isOwner,  upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListing))
    // delete route
    .delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing));


// Edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(ListingController.renderEditForm));


module.exports = router;