const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    // The ticket this comment belongs to
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
    // The user who wrote this comment
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
