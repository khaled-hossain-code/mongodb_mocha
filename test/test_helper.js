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
  try {
    await mongoose.connection.collections.users.drop();
  } catch (err) {
    console.error(err);
  }
})