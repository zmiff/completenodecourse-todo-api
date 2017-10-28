// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //object destructering

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('unable to connect to MongoDB server'); // return is only so the rest of the function wont run if there is an error
  }
  console.log('Connected to MongoDB server');

//   db.collection('Todos').insertOne({
//     text: 'Something to do',
//     completed: false
//   },(err, result)=>{
//     if(err){
//       return console.log('unable to insert todo', err);
//     }
//
//     console.log(JSON.stringify(result.ops, undefined, 2))
//   });
//

  // db.collection('Users').insertOne({
  //   name: 'Ugur',
  //   age: 33,
  //   location: 'Hasselager'
  // },(err, result)=>{
  //   if(err){
  //     return console.log('unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
  // });

  db.close();
});
