'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * Module Dependencies
 */


let userSchema = new Schema({
  userId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default:''
  },
  password: {
    type: String,
    default: 'passskdajakdjkadsj'
  },
  email: {
    type: String,
    default: ''
  },
  mobileNumber: {
    type: Number,
    default: 0
  },
  events: [{
    type: Schema.Types.ObjectId, ref: 'Event',
  }],
  createdOn :{
    type:Date,
    default:""
  }


})


mongoose.model('User', userSchema);