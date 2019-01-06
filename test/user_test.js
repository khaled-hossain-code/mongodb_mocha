const assert = require('assert');
const User = require('../src/user');

describe('Creating records', () => {
  it('saves a user', async () => {
    const joe = new User({
      name: 'joe'
    });

    await joe.save();
    assert(joe.isNew === false);
  })
});

describe('Reading users from db', () => {
  let joe;

  beforeEach(async () => {
    joe = new User({
      name: 'Joe'
    });

    await joe.save();
  });

  afterEach(() => {

  })

  it('finds all users with a name of joe', async () => {
    const users = await User.find({
      name: 'Joe'
    });

    assert(users.length > 0);
  })
})