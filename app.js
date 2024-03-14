if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
.then(() =>console.log("connected to db"))
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
        secret: process.env.SECRET,
      },
      touchAfter:24*60*60
})

// user ka session banane ke liye use krte hai session
const sessionOption = {
    store:store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }  
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use "serialize" => user se ya user ka data save karna ek session me se
//  and "deserialize" user se ya user ka data unsave (unstore/remove/hatana) karna ek session me se 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// koi bhi flash yaha aa rha hai toh res.locals me success ya error variable ban jayega
// aur req.flash me key(success) wala us variable me store ho jayega -> ["listing are added"] 
// nahi toh bas success banega but kuch store nahi hoga  -> [] isliye <%if(success && success.length){%> ye likhe hai
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// routes folder wala sare route yaha use krna hai
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.get("/", (req,res) =>{
    res.render("global.ejs");
});


// agar upar kisi route se nahi match hua tab
// ye all route wala chalega
app.all("*", (req,res,next) =>{
    next( new ExpressError( 404,"Page Nahi Hai!!" ));
});


// middleware for error handling
app.use((err,req,res,next) =>{
    let {statusCode = 500,message = "Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
});

// to listen on port
app.listen(8080 , () =>{
    console.log("server is start at port 8080");
});
