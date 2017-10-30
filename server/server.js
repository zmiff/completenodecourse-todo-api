const express = require('express');
const bodyParser = require('body-parser'); //bodyparser takes JSON and turns it into an object
const {ObjectID} = require('mongodb')

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//storing new todo send by POSTMAN
app.post('/todos',(req,res)=>{
  var todo = new Todo({
    text: req.body.text
  });
  //console.log(req.body);
  todo.save().then((doc)=>{
    res.send(doc)
  },(e)=>{
    res.status(400).send(e);
  });
});

//get all the DOCS in the todos collection
app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos})
  },(e)=>{
    res.status(400).send(e);
  });
});

// GET /todos/id : fetch todo by requested id
app.get('/todos/:id', (req,res)=>{
  var id = req.params.id;
  //Validate id using isValid
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //findById(req.params.id)
  Todo.findById(id).then((todo)=>{
    if(!todo){
      return res.status(404).send()
    }
      res.send({todo}); //we added {} so the response is an object we can now use the properties.

  }).catch((e)=>res.status(400).send());
});

// DELETE /id : delete a DOC with by id
app.delete('/todos/:id',(req,res)=>{
  //get the id
  var id = req.params.id;
  //validate the id -> not valid? return 404
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  //remove todo by id
  Todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo}); //we added {} so the response is an object we can now use the properties.
  }).catch((e)=>res.status(400).send())
});



app.listen(port,()=>{
  console.log(`Started on ${port}.`)
});

module.exports = {app};
