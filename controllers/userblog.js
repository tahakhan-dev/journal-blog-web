const _ = require('underscore');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const Post = require('../models/post');
const Blog = require('../models/blog');
const User = require('../models/user');



exports.getviewblog =(req, res, next) =>{
  Blog.find().then(blogpost =>{

    var sort = _.sortBy(blogpost, 'views').reverse();
    console.log('yeh sort wala hai');
    console.log(sort);

    const popular_post1 = sort[0];
    const popular_post2 = sort[1];
    const popular_post3 = sort[2];

    res.render('user/vblog',{
      blogs:blogpost,
      popularPost1 : popular_post1,
      popularPost2: popular_post2,
      popularPost3: popular_post3
    });
  }).catch(err=>{
    console.log(err);
  });
};

exports.postviewblog =(req, res, next) =>{

};

exports.getBlogDetail = (req, res, next) =>{
  const blogId = req.params.blogID;
  console.log(blogId);
  Blog.findById(blogId).then(blog =>{

    console.log('yeh param wala hai');
    console.log(blog);

    var bloguserID = req.user._id.toString();

    var getBlogViewID = blog.Blog_views.user_views.find(id => id.userId.toString() === bloguserID);

    if(getBlogViewID == undefined){
      blog.Blog_views.user_views.push({userId:req.user});
      var viewslength = blog.Blog_views.user_views.length;
      blog.views = viewslength;
      blog.save();
      res.render('user/blog-detail',{
        blog:blog
      });
    }else {
      if (getBlogViewID.userId.toString() === req.user._id.toString()){

        res.render('user/blog-detail',{
          blog:blog,
        });
      }
    }

  }).catch(err=>{
    console.log(err);
  });
};

exports.getcomposeblog =(req, res, next) =>{

  res.render('user/cblog');
};

exports.postcomposeblog =(req, res, next) =>{

  // var today = new Date();
  // var dd = String(today.getDate()).padStart(2, '0');
  // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  // var yyyy = today.getFullYear();
  // today = mm + '/' + dd + '/' + yyyy;

  today = moment().format("MMM Do YYYY");

  var blogDate = today;
  var blogTitle = req.body.blogTitle;
  var bImage = req.file; // image will be an object
  var blogDescription = req.body.blogDescription;

  console.log(bImage);

  if (!bImage){
    console.log('wrong image');
    return res.status(422).render('user/cblog')
  }

  const blogImage = bImage.path; // hum path is wajha se store krwa rahai han q ke image ke file Mbs tak chale jate han toh jbhi hum image ke path store kr wate han
  console.log(blogImage);

  const blog = new Blog({
    title: blogTitle,
    date:blogDate,
    Image:blogImage,
    Description: blogDescription,
    views: 0,
    userId: req.user
  });
  blog.save().then(result =>{
    console.log('Created Post');
    console.log(result);
    res.redirect('/vblog');
  }).catch(err =>{
    console.log(err);
  });
};

exports.getInvoice = (req,res,next)=>{
  const blogId = req.params.blogID;
  const invoiceName = 'invoice-' + blogId + '.pdf';
  const invoicePath = path.join('data','invoices',invoiceName);
  fs.readFile(invoicePath,(err,data)=>{
    if(err){
      return next();
    }
    res.send(data);
  });
};
