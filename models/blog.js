const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  date:{
    type: String,
    required: true
  },
  Image:{
    type:String,
    required:true
  },
  Description:{
    type:String,
    required:true
  },
  Blog_views:{
    user_views:[
      {userId:Schema.Types.ObjectId}
    ]
  },
  views:{ type:Number},
  userId:{
    type: Schema.Types.ObjectId,
    ref:'User',
    required: true
  }
});


blogSchema.methods.addviews = function(blog){

  const updateviews =[...this.Blog_views.views];

  updateviews.push({
    userId : blog.userId
  });

  const update ={
    views: updateviews
  };

  this.Blog_views = update;
  return this.save();
};



module.exports = mongoose.model('Blog',blogSchema);
