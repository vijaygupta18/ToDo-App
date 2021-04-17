const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    todosInfo: {
      type: Array,
      todoItem: String,
      isDone: Boolean,
    }
  });
  module.exports = mongoose.model('User',userSchema)