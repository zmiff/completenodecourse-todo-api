const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require ('./../models/user')
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(text);
      })
      .end((err, res)=>{
        if(err){
            return done(err);
        }

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>done(e));
    })
  });

  it('should not create new todo with invalid body data',(done)=> {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        }).catch((e)=>done(e));
      })

  })
});

describe('GET /todos route',()=>{
  it('should get all todos', (done)=>{
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2)
      })
      .end(done);
  })
})

describe('GET /todos/:id',()=>{
  it('should return todo doc', (done)=>{
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  });

  it('should return 404 if todo not found', (done)=>{
    var hexID = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexID}`)
    .expect(404)
    .end(done)
  });

  it('should return 404 for non-object ids', (done)=>{
    request(app)
    .get('/todos/123acb')
    .expect(404)
    .end(done)
  });
});

describe('DELETE /todos/:id', ()=>{
  it('should remove a todo',(done) =>{
    var hexId = todos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res)=>{
        if(err){
          return done(err);
        }

        //query databa using findById toNotExist
        Todo.findById(hexId).then((removed)=>{
          expect(removed).toNotExist();
          expect(404);
          done();
        }).catch((e)=>done(e))
      })
  });

  it('should return 404 if todo not found', (done)=>{
    var hexID = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexID}`)
    .expect(404)
    .end(done)
  });

  it('should return 404 if object id invalid', (done)=>{
    request(app)
    .delete('/todos/123acb')
    .expect(404)
    .end(done)
  });
});

describe('PATCH /todos/:id,', ()=>{
  it('should update the todo', (done)=>{
    //grab id of first item
    var hexID = todos[0]._id.toHexString();
    //update text, set completed true
    request(app)
    .patch(`/todos/${hexID}`)
    .send({
      completed: true,
      text: "changed text",
    })
    .expect(200)
    //text is changed, completed is true, completedAt is a number .toBeA
    .expect((res)=>{
      expect(res.body.todo.text).toBe("changed text");
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done)
  });

  it('should clear completedAt whentodo is not completed', (done)=>{
    //grab id of second todo item
    var hexID = todos[1]._id.toHexString();
    //update text, set completed to false
    request(app)
      .patch(`/todos/${hexID}`)
      .send({
        text: "changed text, completed false",
        completed: false
      })
      .expect(200)
      //text is changed, completed false, completedAt is null .toNotExist
      .expect((res)=>{
        expect(res.body.todo.text).toInclude("changed text, completed false");
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done)
  })
});

describe('GET /users/me', ()=>{
  it('should return a user if authenticated',(done)=>{
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done)
  });

  it('should return a 401 if not authenticated', (done)=>{
    //not provide x-auth token, expect 401 back expect body to be empty object toEqual
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res)=>{
      expect(res.body).toEqual({});
    })
    .end(done)
  })
})

describe('POST users', ()=>{
  it('should create a user', (done)=>{
    var email = 'example@example.com';
    var password = '123mnb';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res)=>{
        expect(res.header['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err)=>{
        if(err){
          return done(err);
        }

        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      })
  });

  it('shuld return validation errors if request invalid', (done)=>{
    //send invalid email & invalid password
    var email = 'invalidemail';
    var password = 'short';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)
  });

  it('should not create user if email in use', (done)=>{
    //use email already taken
    var email = users[0].email;
    var password = 'userpassword';

    request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done)
  });
})
