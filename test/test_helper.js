const mongoose = require('mongoose');

// Run only one time before all test
before((done) => {
  mongoose.connect('mongodb://localhost/users_test', {
    useNewUrlParser: true
  });

  mongoose.connection
    .once('open', () => { done(); })
    .on('error', (err) => console.error(err));

})

// Run before each test
beforeEach(async () => {
  const { users, comments, blog_posts } = mongoose.connection.collections; 
  try {
    await users.drop();
    await comments.drop();
    await blog_posts.drop();
  } catch (err) {
    console.error(err);
  }
})