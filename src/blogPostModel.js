const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
  title: String,
  content: String,
  comments: [{ //this is referencing to comments collection
    type: Schema.Types.ObjectId,
    ref: 'comment' //this is the name of the model
  }]
})

const BlogPost = mongoose.model('blog_post', BlogPostSchema);

module.exports = BlogPost;