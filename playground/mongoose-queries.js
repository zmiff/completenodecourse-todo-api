const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var todoid = '59f5f995e8be6a9305a33eb3';
var userid = '79f5b36dc452344dbdcd80bf';

// if(!ObjectID.isValid(id)){
//   console.log('ID not valid');
// }

// Todo.find({
//   _id: todoid
// }).then((todos)=>{
//   console.log('Todos: ',todos);
// });
//
// Todo.findOne({
//   _id: todoid
// }).then((todo)=>{
//   console.log('Todo: ',todo);
// });

// Todo.findById(todoid).then((todoById)=>{
//   if(!todoById){ //if the id is not found
//     return console.log('Id not found');
//   }
//   console.log('TodoById: ',todoById);
// }).catch((e)=>console.log(e)); //if there is an error other than id not found;

User.findById(userid).then((user)=>{
  if(!user){
    return console.log('ID not found');
  }
  console.log(JSON.stringify(user,undefined,2));
}).catch((e)=>console.log(e));
