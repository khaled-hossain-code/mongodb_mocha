const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/userModel');
const BlogPost = require('../src/blogPostModel');

describe('Middlewares', () => {
  let joe, blogPost;

  beforeEach(async () => {
    joe = new User({
      name: 'joe'
    });

    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really is'
    });

    joe.blogPosts.push(blogPost);

    await Promise.all([joe.save(), blogPost.save()]);
  })

  it('will remove associated blogposts when user is removed', async () => {
    await joe.remove();
    const count = await BlogPost.countDocuments();
    assert(count === 0)
  });

});