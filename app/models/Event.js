'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose');
const  Schema = mongoose.Schema;

let eventSchema = new Schema({
  eventId: {
    type: String,
    default: '',
    index: true,
    unique: true
  },
  uId: {
    type: Schema.Types.ObjectId, ref:'User'
  },
  title: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  start: {
    type: Date,
    default: "",
  },
  end: {
    type: Date,
    default: "",
  },
  created :{
    type:Date,
    default:""
  },
  lastModified :{
    type:Date,
    default:""
  }


})


mongoose.model('Event', eventSchema);