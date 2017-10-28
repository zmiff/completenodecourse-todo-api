// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //object destructering

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('unable to connect to MongoDB server'); // return is only so the rest of the function wont run if there is an error
  }
  console.log('Connected to MongoDB server');

    //printing the doc with the id of 59f4c635a7bd788e8d4c8df2 in the Todos collection as an array
    // db.collection('Todos').find({_id: new ObjectID('59f4c635a7bd788e8d4c8df2')}).toArray().then((docs)=>{
    //   console.log('Todos');
    //   console.log(JSON.stringify(docs, undefined, 2));
    // },(err)=>{
    //   console.log('unable to fetch todos')
    // });

    // count the number of docs
    // db.collection('Todos').find().count().then((count)=>{
    //   console.log(`Todos count: ${count}`);
    // },(err)=>{
    //   console.log('unable to fetch todos')
    // });

    db.collection('Users').find({name: 'Ugur'}).toArray().then((docs)=>{
      console.log('Users');
      console.log(JSON.stringify(docs, undefined, 2));
    },(err)=>{
      console.log('unable to fetch Todos');
    });

  //db.close();
});
