///////////////////////////////////
///////////////////////////////////
let db = {

  users: [
    {
      userId: 'o9clL2k556Rez7IP7WqP3E3cPFe2',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2020-04-29T04:01:44.197Z',
      imageUrl: 'image/91233025256.JPG',
      bio: 'I am a student at WSUV',
      website: 'https://LinkedIn.com',
      location: 'Portland, OR'
    }
  ],
  thumps: [
    {
      userHandle: 'user',
      body: 'A random thump test message. Hello good people of Jackalope town',
      createdAt: '2020-04-29T04:01:44.197Z',
      likeCount: 23,
      commentCount: 11
    }
  ],
  comments: [
    {
      userHandle: 'user',
      thumpId: 'nBxQvcJ25zJJX6Ftgece',
      body: 'Hello hello and welcome',
      createdAt: '2020-04-29T04:01:44.197Z'
    }
  ],
  notifications: [
    {
      recipient: 'user',
      sender: 'john',
      read: 'true | false',
      thumpId: 'nBxQvcJ25zJJX6Ftgece',
      type: 'like | comment',
      createdAt: '2020-04-29T04:01:44.197Z'
    }
  ]
};
///////////////////////////////////
///////////////////////////////////
const userDetails = {
  credentials: {
    userId: 'o9clL2k556Rez7IP7WqP3E3cPFe2',
    email: 'user@email.com',
    handle: 'user',
    createdAt: '2020-04-29T04:01:44.197Z',
    imageUrl: 'image/91233025256.JPG',
    bio: 'I am a student at WSUV. Nice of you to drop by',
    website: 'https://LinkedIn.com',
    location: 'Portland, OR'
  },

  likes: [
    {
      userHandle: 'user',
      thumpId: 'hh7O5oWfWucVzGbHH2pa'
    },
    {
      userHandle: 'user',
      thumpId: '3IOnFoQexRcofs5OhBXO'
    }
  ]
};
///////////////////////////////////
///////////////////////////////////