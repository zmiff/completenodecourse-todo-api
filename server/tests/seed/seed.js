const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneID =  new ObjectID;
const UserTwoID = new ObjectID;

const users = [{
  _id : userOneID,
  email : 'ugur@example.com',
  password : 'user1password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userOneID,access: 'auth', }, 'abc123').toString()
  }]
},{
  _id: UserTwoID,
  email: 'UgurTwo@example.com',
  password: 'user2password'
}];

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

const populateTodos = (done)=>{
  Todo.remove({}).then(()=> { //wipes the Todo collection
    return Todo.insertMany(todos); //insert the todos array above in the todos collection
  }).then(()=>done());
}

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    //promise.all([x,y]) will not get fired before all of x,y is loaded
    return Promise.all([userOne, userTwo])
  }).then(()=>done());
};

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers
};
