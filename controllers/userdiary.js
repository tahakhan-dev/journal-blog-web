const _ = require('lodash');

const Post = require('../models/post');
const Blog = require('../models/blog');
const User = require('../models/user');

const post_per_page = 2;

exports.getUser =(req, res, next) =>{
  res.render('user/index');
};

exports.postUser =(req, res, next) =>{
  let name = req.body.name;
  let email = req.body.email;
  let message = req.body.message;
  console.log(name);
  console.log(email);
  console.log(message);
};

exports.getviewpost =(req, res, next) =>{

  const page = +req.query.page || 1 ; // yeh hum pagination kr rahai han ke aik page me hum kitne item dekhna chate han + lagane ke wajha se yeh hota hai ke string convert hojata hai number me agr usme masla ajae toh 1 utha le
  console.log(typeof page);
  let totalPost;

  var today = new Date();
  var yyyy = today.getFullYear();

  var yearSearch = req.query.searchYear;
  var searchHiddenval = req.query.hiddenSearchVal;
  var userID = req.user._id;
  var hiddenValue = req.query.hiddenCal;
  var userID = req.user._id;

  if(searchHiddenval == 'true'){

    Post.find({userId:userID,year:yearSearch}).sort('day').countDocuments()
    .then(numPost =>{
      totalPost = numPost;
      console.log(totalPost);
      return Post.find({userId:userID,year:yearSearch}).sort('day').skip((page - 1) * post_per_page)// yeh jo skip use keya hai woh pagination ke leye istamal keya hai i.e " page ke value 1 hai 1-1 zero hua or post_per_page se multiply hoke 0 hua means 0 skip or phir limt 2 rake hai mtlb skip kuch nhi krna bss shuru ke 2 item dekhado q ke humne uski limit 2 rake hai"
      // ise tarha agr page 2 hoga toh skip 2 kare ga or limit 2 hoge mtlb 2 post skip krne ke  baad jo value hoge woh dekhao uski limit bhi do rake hai
      .limit(post_per_page);
    })
    .then(postDoc=>{
      console.log(Math.ceil(totalPost / post_per_page));
      res.render('user/viewpost',{
        postss:postDoc,
        year:yyyy,
        searchvalue: searchHiddenval,
        currentPage:page,
        totalPost:totalPost,// yeh jo total post hai woh apka number me hoaga means ke '4' post hai pore documnet me istaraha hai q ke yeh documnet count kr raha hai
        hasNextPage: post_per_page * page < totalPost, // hasNextPage hai woh 'true' or 'false' indono me se koi aik hoga agr true hoga to means next page rakhta hai q ke total post se kaam hai toh obviously se baat hai next page rakhe ga agr total post se zyada hoag toh next page nhi rakhe ga
        hasPreviousPage: page > 1, // page ke value choti hoge toh false hoga means PreviousPage nhi rakhta agr page ke value bare hoge 'true' hoge toh page rakhta hai
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalPost / post_per_page) // or last page ase nikle ga ke total post ko divide krdo post_per_page se or jo value aye ge woh apki last value hoge
      });
    }).catch(err =>{
      console.log(err);
    });
  }

  else if(hiddenValue == 'true'){

    var calDates = req.query.date
    var calDate = calDates.split('-');
    var year = calDate[0];
    var month = calDate[1];
    var day = calDate[2];
    var cal = [month,day,year];
    var calenderDate= cal.join("/");

    Post.find({userId:userID,date:calenderDate}).sort('day').countDocuments()
    .then(numPost =>{
      totalPost = numPost;
      console.log(totalPost);
      return Post.find({userId:userID,date:calenderDate}).sort('day').skip((page - 1) * post_per_page)// yeh jo skip use keya hai woh pagination ke leye istamal keya hai i.e " page ke value 1 hai 1-1 zero hua or post_per_page se multiply hoke 0 hua means 0 skip or phir limt 2 rake hai mtlb skip kuch nhi krna bss shuru ke 2 item dekhado q ke humne uski limit 2 rake hai"
      // ise tarha agr page 2 hoga toh skip 2 kare ga or limit 2 hoge mtlb 2 post skip krne ke  baad jo value hoge woh dekhao uski limit bhi do rake hai
      .limit(post_per_page);
    })
    .then(postDoc=>{
      console.log(Math.ceil(totalPost / post_per_page));
      res.render('user/viewpost',{
        postss:postDoc,
        year:yyyy,
        currentPage:page,
        hiddenCal: hiddenValue,
        totalPost:totalPost,// yeh jo total post hai woh apka number me hoaga means ke '4' post hai pore documnet me istaraha hai q ke yeh documnet count kr raha hai
        hasNextPage: post_per_page * page < totalPost, // hasNextPage hai woh 'true' or 'false' indono me se koi aik hoga agr true hoga to means next page rakhta hai q ke total post se kaam hai toh obviously se baat hai next page rakhe ga agr total post se zyada hoag toh next page nhi rakhe ga
        hasPreviousPage: page > 1, // page ke value choti hoge toh false hoga means PreviousPage nhi rakhta agr page ke value bare hoge 'true' hoge toh page rakhta hai
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalPost / post_per_page) // or last page ase nikle ga ke total post ko divide krdo post_per_page se or jo value aye ge woh apki last value hoge
      });
    }).catch(err =>{
      console.log(err);
    });


  } else{

    Post.find({userId:userID}).sort('day').countDocuments()
    .then(numPost =>{
      totalPost = numPost;
      console.log(totalPost);
      return Post.find({userId:userID}).sort('day').skip((page - 1) * post_per_page)// yeh jo skip use keya hai woh pagination ke leye istamal keya hai i.e " page ke value 1 hai 1-1 zero hua or post_per_page se multiply hoke 0 hua means 0 skip or phir limt 2 rake hai mtlb skip kuch nhi krna bss shuru ke 2 item dekhado q ke humne uski limit 2 rake hai"
      // ise tarha agr page 2 hoga toh skip 2 kare ga or limit 2 hoge mtlb 2 post skip krne ke  baad jo value hoge woh dekhao uski limit bhi do rake hai
      .limit(post_per_page);
    })
    .then(postDoc=>{
      console.log(Math.ceil(totalPost / post_per_page));
      res.render('user/viewpost',{
        postss:postDoc,
        year:yyyy,
        currentPage:page,
        totalPost:totalPost,// yeh jo total post hai woh apka number me hoaga means ke '4' post hai pore documnet me istaraha hai q ke yeh documnet count kr raha hai
        hasNextPage: post_per_page * page < totalPost, // hasNextPage hai woh 'true' or 'false' indono me se koi aik hoga agr true hoga to means next page rakhta hai q ke total post se kaam hai toh obviously se baat hai next page rakhe ga agr total post se zyada hoag toh next page nhi rakhe ga
        hasPreviousPage: page > 1, // page ke value choti hoge toh false hoga means PreviousPage nhi rakhta agr page ke value bare hoge 'true' hoge toh page rakhta hai
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalPost / post_per_page) // or last page ase nikle ga ke total post ko divide krdo post_per_page se or jo value aye ge woh apki last value hoge
      });
    }).catch(err =>{
      console.log(err);
    });
    // req.user.populate('Post.years')// populate mtlb fetch karo data or path btao reference do kaha se get krna hai or "then" jo promise hai woh work nhi kare ga populate ke sath toh hume "execPopulate()" use karo ge toh phir then use kr sakte ho
    // .execPopulate()
    // .then(user =>{
    //   const posts = user.Post.years;
    //   res.render('user/viewpost',{
    //     postss:posts,
    //     year:yyyy
    //   });
    // }).catch(err =>{
    //   console.log(err);
    // });
  }
};

exports.getProductDetails = (req, res,next) =>{
  const postId = req.params.postID;
  console.log(postId);
  Post.findById(postId).then(post =>{

    console.log('yeh param wala hai');
    console.log(post);
    res.render('user/post-details',{
      post:post
    });
  }).catch(err=>{
    console.log(err);
  });
};

exports.postviewpost =(req, res, next) =>{


  // const calDate = req.body.date.split("-");
  // userID = req.user._id;
  //
  // var year = calDate[0];
  // var month = calDate[1];
  // var day = calDate[2];
  // var cal = [month,day,year];
  // var calenderDate= cal.join("/");
  //
  // Post.find({userId:userID,date:calenderDate}).then(postDoc =>{
  //   console.log("post found");
  //
  // }).catch(err=>{
  //   console.log(err);
  // });
};

exports.getCompose =(req, res,next) =>{
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  } else{
    message = null;
  }
  res.render('user/compose',{
    errorMessage: message
  });
};

exports.postCompose = (req, res, next) =>{
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '/' + dd + '/' + yyyy;


  var postday = req.body.day;
  var postTitle = req.body.postTitle;
  var postBody = req.body.postBody;
  var userID = req.user._id;

  console.log(typeof yyyy);

  Post.findOne({day:postday,userId:userID}).then(postDoc =>{
    if(postDoc){
      req.flash('error','Post already Exists');
      res.redirect('/compose');
    }else{
      const post = new Post({
        year: yyyy,
        day: postday,
        title: postTitle,
        description: postBody,
        date: today,
        userId: req.user
      });
      post.save().then(result =>{
        console.log('Created Post');
        req.user.addPost(result);
        res.redirect('/viewpost');
      }).catch(err =>{
        console.log(err);
      });
    }
  }).catch(err =>{
    console.log(err);
  });
};

exports.getPostEdit = (req, res, next) =>{
  const postID = req.params.postID;
  console.log(postID);
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  } else{
    message = null;
  }

  Post.findById(postID).then(postDoc =>{
    if(!postDoc){
      return res.redirect('/viewpost');
    }
    res.render('user/post-edit',{
      post: postDoc,
      errorMessage: message
    });
  }).catch(err=>{
    console.log(err);
  });
};

exports.postEdit = (req, res, next) =>{

  const postId = req.body.postID;
  const updatedDay = req.body.day;
  const updatedTitle = req.body.postTitle;
  const updatedDescription = req.body.postBody;

  Post.findById(postId)
  .then(postDoc => {
    postDoc.day = updatedDay;
    postDoc.price = updatedTitle;
    postDoc.description = updatedDescription;

    return postDoc.save();
  })
  .then(result => {
    console.log('UPDATED PRODUCT!');
    res.redirect('/viewpost');
  })
  .catch(err => console.log(err));

}

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findByIdAndRemove(postId)
  .then(() => {
    console.log('DESTROYED PRODUCT');
    // yeh jo json ke andr hai woh data ha or humise parse kar rahai han json data me
    res.status(200).json({message: 'Success'});
  })
  .catch(err => {
    res.status(500).json({message:'Deleting product failed'});
  });
};
