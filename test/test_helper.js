const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/users_test');

mongoose.connection
  .once('open', () => console.log('good to go'))
  .on('error', (err) => console.error(err));

beforeEach(async () => {
  try {
    await mongoose.connection.collections.users.drop();
  }catch (err) {
    console.error(err);
  }
})