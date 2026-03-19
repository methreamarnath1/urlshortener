const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",    
        required: true,
    },
    originalUrl: {
        type: String,   
        required: true,
    },
    shortUrl: { 
        type: String,
        required: true,
        unique: true,
    },
    clicks: {
        type: Number,
        default: 0, 
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Url", urlSchema);
