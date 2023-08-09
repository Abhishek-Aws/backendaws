//const mongoose = require('mongoose');
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 3000
    },
    price: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    stock: {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    },
    code: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    sold: {
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer,
        contentType: String
    },
   taxrate : {
        type: Number,
        required: true,
        maxlength: 32,
        trim: true
    } 

}, {timestamps: true});

module.exports = mongoose.model("Product", productSchema)