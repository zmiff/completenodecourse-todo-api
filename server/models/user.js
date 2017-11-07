const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt =require('bcryptjs');

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(()=>{
    return token;
  });
};

userSchema.methods.removeToken = function (token){
  var user = this;

  return user.update({
    $pull: {
      tokens:{token}
    }
  });
}

//create findByToken method.
userSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
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

userSchema.statics.FindByCredentials = function(email, password){
  var User = this;

  return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve, reject)=>{
      bcrypt.compare(password, user.password, (err, res)=>{
        if(res){
          resolve(user);
        }else{
          reject();
        }
      });
    })
  });
}

//do something before save
userSchema.pre('save',function(next){
  var user = this;

  //we only want to do the following if the password is modified.
  if(user.isModified('password')){
    bcrypt.genSalt(10, function(err,salt){
      bcrypt.hash(user.password,salt,function(err,hash){
        user.password = hash;
        next();
      });
    });
  }else{
    next();
  }
});

var User = mongoose.model('User', userSchema);

module.exports = {User}
