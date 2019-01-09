const assert = require('assert');
const User = require('../src/userModel');
const Comment = require('../src/commentModel');
const BlogPost = require('../src/blogPostModel');

describe.only('Assoiations', () => {
  let joe, blogPost, comment;

  beforeEach(async () => {
    joe = new User({
      name: 'joe'
    });
    blogPost = new BlogPost({
      title: 'JS is Great',
      content: 'Yep it really is'
    });
    comment = new Comment({
      content: "Congrats on great post"
    })

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    await Promise.all([joe.save(), blogPost.save(), comment.save()]);
  })

  it('saves a relation between a user and a blogpost', async () => {
    const user = await User.findOne({
      name: 'joe'
    }).populate('blogPosts'); //populate the property in user model

    assert(user.blogPosts[0].title === blogPost.title);
  });

  it('loads a full relation graph', async () => {
    const user = await User.findOne({
      name: 'joe'
    }).populate({
      path: 'blogPosts',
      populate: {
        path: 'comments',
        model: 'comment',
        populate: {
          path: 'user',
          model: 'user'
        }
      }
    });

    const { name, blogPosts } = user;
    const { title, comments } = blogPosts[0];
    
    assert(name === 'joe');
    assert(title === 'JS is Great');
    assert(comments[0].content === 'Congrats on great post');
    assert(comments[0].user.name === 'joe');
  });
});