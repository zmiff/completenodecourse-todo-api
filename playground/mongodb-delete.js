// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //object destructering

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('unable to connect to MongoDB server'); // return is only so the rest of the function wont run if there is an error
  }
  console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos').deleteMany({text: 'eat launch'}).then((result)=>{
    //   console.log(result);
    // },(err)=>{
    //   console.log('Error: ',err)
    // });

    // //deleteOne
    // db.collection('Todos').deleteOne({text: 'eat launch'}).then((result)=>{
    //   console.log(result);
    // },(err)=>{
    //   return console.log('Error: ',err);
    // });
    //
    // //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
    //   console.log('result');
    // },(err)=>{
    //   console.log('Error: ',err);
    // });

    db.collection('Users').deleteMany({name: 'Ugur'});

    db.collection('Users').findOneAndDelete({_id: new ObjectID('59f4a2566cf37f224eb3084a')});


  //db.close();
});
