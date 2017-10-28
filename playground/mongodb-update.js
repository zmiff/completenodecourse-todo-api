// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); //object destructering

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  if(err){
    return console.log('unable to connect to MongoDB server'); // return is only so the rest of the function wont run if there is an error
  }
  console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //   _id: new ObjectID('59f5028ca7bd788e8d4c94aa')
    // },{
    //   $set:{
    //     completed: true
    //   }
    // },{
    //   returnOriginal: false // if this is not set to false, the original doc will return
    // }).then((result)=>{
    //   console.log(result);
    // },(err)=>{
    //   console.log('Error: ',err);
    // });

    db.collection('Users').findOneAndUpdate({
      _id: new ObjectID('59f4c181b812b924388730ed')
    },{
        $inc:{age: 1},
        $set:{name: 'Ugur'}
      },{
        returnOriginal: false
      }).then((result)=>{
      console.log(result);
    });

  //db.close();
});
