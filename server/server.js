require('./config/config.js')

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser'); //bodyparser takes JSON and turns it into an object
const {ObjectID} = require('mongodb')


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate')

var app = express();
const port = process.env.PORT;

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

// PATCH / id updating DOC

app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id;
  var body =_.pick(req.body,['text', 'completed']); //this is so users can only uptade text and completed.
  //check to see if id is valid
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed)&&body.completed){ //is body.completed a boolean and is it true?
    body.completedAt = new Date().getTime(); //sets the completed at time
  }else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo})
  }).catch((e)=>{
      res.status(400).send();
  });

});

//post new user
app.post(('/users/'),(req,res)=>{
  //pick body object
  var body =_.pick(req.body,['email', 'password']);
  //store attributes in new user
  var user = new User(body);
  // save the doc to the collection
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

// GET /me user
app.get('/users/me', authenticate,(req,res)=>{
  //user form authenticate(); middleware
  res.send(req.user);
});

// POST /users/login {email, password}
app.post(('/users/login'),(req,res)=>{
  var body =_.pick(req.body,['email','password']);

  User.FindByCredentials(body.email,body.password).then((user)=>{
    user.generateAuthToken().then((token)=>{
      res.header('x-auth', token).send(user);
    });
  }).catch((e)=>{
    res.status(400).send();
  });

});

app.delete('/users/me/token',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }, ()=>{
    res.status(400).send();
  });
});


app.listen(port,()=>{
  console.log(`Started on ${port}.`)
});

module.exports = {app};
