var mongoose = require('mongoose');

//mongoose model so mongoose knows how to store data:
var Todo = mongoose.model('Todo', {
  text: { //attribute
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  },
  _creator:{
    type: mongoose.Schema.Types.ObjectId,
    required: true

  }
});

module.exports = {Todo};
