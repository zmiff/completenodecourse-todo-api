const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

Todo.findOneAndRemove(_id: '59f78088a7bd788e8d4cba4e').then((todo)=>{
  console.log(todo);
})

Todo.findByIdAndRemove('59f78088a7bd788e8d4cba4e').then((todo)=>{
  console.log(todo);
});
