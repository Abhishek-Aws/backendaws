
const mongoose = require('mongoose');

// import mongoose from 'mongoose';
const crypto = require('crypto');
// const uuidv1 = require('uuid');
const { v1: uuidv1 } = require('uuid');

var  userSchema = new mongoose.Schema ({
    name:{
        type: String,
        required: true,
        maxLength: 50,
        trim: true
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    phoneno: {
        type: Number,
        trim: true,
        sparse:true
    },
    // userinfo: {
    //     type:String,
    //     trim: true
    // },
    address1:{
        type: String,
        trim: true,
        maxLength: 50,
        sparse:true
    },
    address2:{
        type: String,
        trim: true,
        maxLength: 50,
        sparse:true
    },
    city: {
        type: String,
        trim: true,
        maxLength: 50,
        sparse:true
    },
    pincode:{
        type: Number,
        trim: true,
        maxLength: 20,
        sparse:true
    },
    encry_password: {
        type: String,
        required: true,
        sparse:true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases : {
        type: Array,
        default: []
    }

})

userSchema.virtual("password")
.set(function(password){
    this._password = password
    this.salt = uuidv1()
    this.encry_password = this.securePassword(password)
})
.get(function(){
    return this._password;
})

userSchema.methods = {

    authenticate : function(plainpassword){
        return this.securePassword(plainpassword) === this.encry_password
    },

    securePassword: function(plainpassword){
        if(!plainpassword) return "";
        try {
            return crypto
            .createHmac("sha256", this.salt)
            .update(plainpassword)
            .digest("hex");
        }catch (err){
            return "";
        }

    }
}

module.exports = mongoose.model("User", userSchema);