const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = require('./postSchema');

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: {
      validator: (name) => name.length > 2,
      message: 'Name must be longer than 2 characters'
    }
  },
  likes: Number,
  posts: [PostSchema], //this is subdocumenting not reference
  blogPosts: [{
    type: Schema.Types.ObjectId,
    ref: 'blog_post'
  }]
});

UserSchema.virtual('postCount').get(function () {
  return this.posts.length;
})

UserSchema.pre('remove', async function (next) {
  const BlogPost = mongoose.model('blog_post');
  
  await BlogPost.deleteMany({
    _id: {
      $in: this.blogPosts
    }
  });

  return next();
})

const User = mongoose.model('user', UserSchema);

module.exports = User;