const mongoose =require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  year:{
    type:Number,
    required:true
  },
  day:{
    type:Number,
    required: true
  },
  title:{
    type:String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  date:{
    type: String,
    requred: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    ref:'User',
    required: true
  }
});

module.exports = mongoose.model('Post',postSchema);
