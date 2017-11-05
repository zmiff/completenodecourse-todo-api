const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate:[{
      isAsync: false,
       validator: validator.isEmail,
       message: "{VALUE} is not a valid email"
     }]
  }, //end email
  password: {
    type: String,
    required: true,
    minlength: 6
  }, //end password
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token:{
      isAsync: false,
      type: String,
      required: true
    }
  }] //end tokens
});

//user will only get the id email return not token and pass...
userSchema.methods.toJSON = function(){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function (){
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{
    return token;
  });
};

//create findByToken method.
userSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, 'abc123');
  }catch (e){
    // return new Promise ((resolve, reject)=>{
    //   reject();
    // })
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

var User = mongoose.model('User', userSchema);

module.exports = {User}
