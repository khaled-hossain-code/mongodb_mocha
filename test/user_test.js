const assert = require('assert');
const User = require('../src/userModel');

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
      likes: 0
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
    await User.findOneAndUpdate({
      name: 'joe'
    }, {
      name: 'alex'
    });

    const users = await User.find({});

    assert(users.length === 1);
    assert(users[0].name === 'alex')
  });

  it('A model class can update by ID', async () => {
    await User.findByIdAndUpdate(joe._id, {
      name: 'alex'
    });

    const users = await User.find({});

    assert(users.length === 1);
    assert(users[0].name === 'alex');
  });

  it('A user can have their likes incremented by 1', async () => {
    await User.updateMany({
      name: 'joe'
    }, {
      $inc: {
        likes: 1
      }
    });

    const user = await User.findOne({
      name: 'joe'
    });

    assert(user.likes === 1);
  });

});

describe('Validating User model', () => {
  it('requires a user name', () => {
    const user = new User({
      name: undefined
    });
    const error = user.validateSync();
    assert(error.errors['name'].message === 'Name is required.');
  });

  it('requires a user\'s name longer than 2 characters', () => {
    const user = new User({
      name: 'Al'
    });
    const error = user.validateSync();
    assert(error.errors['name'].message === 'Name must be longer than 2 characters')
  });

  it('disallow invalid records from being save', async () => {
    const user = new User({
      name: 'Al',
      postCount: 0
    });

    try {
      await user.save();
    } catch (error) {
      assert(error.errors['name'].message === 'Name must be longer than 2 characters')
    }
  });
});

describe('Posts Subdocument', () => {
  it('can create a subdocument', async () => {
    const joe = new User({
      name: 'joe',
      posts: [{
        title: 'PostTitle'
      }]
    });

    const user = await joe.save();

    assert(user.posts.length === 1);
    assert(user.posts[0].title === 'PostTitle');
  });

  it('can create post in existing user', async () => {
    const joe = new User({
      name: 'joe',
      posts: []
    });

    const user = await joe.save();

    user.posts.push({
      title: 'PostTitle'
    });

    const savedUser = await user.save();

    assert(savedUser.posts.length === 1);
    assert(savedUser.posts[0].title === 'PostTitle');
  });

  it('can remove an existing subdocument', async () => {
    const joe = new User({
      name: 'joe',
      posts: [{
        title: 'PostTitle'
      }]
    });

    const user = await joe.save();
    const post = user.posts[0];
    post.remove();
    const savedUser = await user.save();

    assert(savedUser.posts.length === 0);
  });
});

describe('Virtual property postCount', () => {
  it('should return one', async () => {
    const joe = new User({
      name: 'joe',
      posts: [{
        title: 'PostTitle'
      }]
    });

    const user = await joe.save();
    assert(user.postCount === 1);
  });
});

describe('Reading users from db with skip and limit', () => {

  beforeEach(async () => {
    const joe = new User({ name: 'joe'});
    const doe = new User({ name: 'doe'});
    const poe = new User({ name: 'poe'});
    const coe = new User({ name: 'coe'});

    await  Promise.all([joe.save(),doe.save(),poe.save(),coe.save()]);
  });

  it('can skip and limit the result set', async () => {
    const users = await User.find({}).skip(1).limit(2);
    assert(users.length === 2);
  });
});
