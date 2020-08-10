const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  date:{
    type: String,
  },
  Post:{
    years:[
      {
        postId:{
          type: Schema.Types.ObjectId,
          ref: 'Post',
          required: true
        },
        day:{
          type:Number,
          required: true
        },
        title:{
          type:String,
          required: true
        },
        date:{
          type: String,
          requred: true
        },
        description:{
          type: String,
          required: true
        },
        year:{
          type:Number,
          required:true
        }
      }
    ]
  }
});

userSchema.methods.addPost = function(post){



  const updatePost =[...this.Post.years];

  updatePost.push({
    postId : post._id,
    day: post.day,
    title: post.title,
    date: post.date,
    description: post.description,
    year: post.year
  });

  const update ={
    years: updatePost
  };

  this.Post = update;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
