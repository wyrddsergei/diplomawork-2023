const mongoose = require('mongoose');

// Define the comment schema
const CommentSchema = new mongoose.Schema(
{
  postId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}
);

// Create the Comment model
module.exports = mongoose.model('Comment', CommentSchema);

