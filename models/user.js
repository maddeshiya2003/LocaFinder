const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new Schema({
    email: {
        type:String,
        require:true
    }
});

// ye "plugin" isliye lagaye hai kyuki isse automatic
//  "userSchema" ke andar kuch field add kar dega jaise ki
//  hashed passward,saltvalue for passward,username,
// aur bhi isse kuch function(instance method) define hog jaise ki  
// 1 - setPassword(password, [cb])
// 2 - changePassword(oldPassword, newPassword, [cb])
// 3 - authenticate(password, [cb])
// 4 - resetAttempts([cb]) e.t.c.   ==> ye kaam hai "plugin" ka 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);