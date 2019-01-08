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
      name: 'joe'
    });

    await joe.save();
  });

  afterEach(() => {

  })

  it('finds all users with a name of joe', async () => {
    const users = await User.find({
      name: 'joe'
    });

    assert(users.length > 0);
  });

  it('find a user with a particular id', async () => {
    const user = await User.findById(joe._id);

    assert(user.name === joe.name);
  });
});

describe('Delete user from db', () => {
  let joe;

  beforeEach(async () => {
    joe = new User({
      name: 'joe'
    });

    await joe.save();
  });

  it('model instance remove', async () => {
    await joe.remove();
    const user = await User.findOne({
      name: 'joe'
    });

    assert(user === null);
  });

  it('class method deleteOne', async () => {
    await User.deleteOne({
      name: 'joe'
    });

    const user = await User.findOne({
      name: 'joe'
    });

    assert(user === null);
  });

  it('class method findAndDelete', async () => {
    await User.findOneAndDelete({
      name: 'joe'
    });

    const user = await User.findOne({
      name: 'joe'
    });

    assert(user === null);
  });

  it('class method findByIdAndRemove', async () => {
    await User.findByIdAndDelete(joe._id);

    const user = await User.findOne({
      name: 'joe'
    });

    assert(user === null);

  });
});

describe('Updating reords', () => {
  let joe;

  beforeEach(async () => {
    joe = new User({
      name: 'joe',
      postCount: 0
    });

    await joe.save();
  });

  it('model instance set n save', async () => {
    joe.set('name', 'alex');
    await joe.save();

    const users = await User.find({});

    assert(users.length === 1);
    assert(users[0].name === 'alex')
  });

  it('A model instance can update', async () => {
    await joe.updateOne({
      name: 'alex'
    });

    const users = await User.find({});

    assert(users.length === 1);
    assert(users[0].name === 'alex')
  });

  it('A model class can update', async () => {
    await User.updateOne({
      name: 'joe'
    }, {
      name: 'alex'
    });

    const users = await User.find({});

    assert(users.length === 1);
    assert(users[0].name === 'alex')
  });

  it('A model class can update by ID', async () => {
    await User.findByIdAndUpdate( joe._id, {
      name: 'alex'
    });

    const users = await User.find({});

    assert(users.length === 1);
    assert(users[0].name === 'alex')
  });

  it('A user can have their postcount incremented by 1', async () => {
    await User.update({ name: 'joe'}, { $inc: { postCount: 1}});

    const user = await User.findOne({ name: 'joe'});

    assert(user.postCount === 1);
  });

});


