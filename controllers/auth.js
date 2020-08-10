const bcrypt = require('bcryptjs');
const { check , validationResult } = require('express-validator');

const User = require('../models/user');


exports.getLogin = (req, res, next) =>{
  let message = req.flash('error');
  if(message.length >0){
    message = message[0];
  }else{
    message = null;
  }
  res.render('auth/login',{
    errorMessage: message,
    oldInput:{
      email:'',
      password:''
    },
  });
};

exports.postLogin = (req, res, next) =>{
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render('auth/login',{
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email: email,
        password: password
      }
    });
  }
  User.findOne({email: email})
  .then(user =>{
    if(!user){
      //req.flash('error','Invalid email or password');
      return res.status(422).render('auth/login',{
        errorMessage:'Invalid email or password.',
        oldInput:{
          email:email,
          password:password
        },
      });
    }
    bcrypt
    .compare(password,user.password)
    .then(doMatch =>{
      if(doMatch){
        console.log('You have sucessfully LogIn');
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err =>{
          console.log(err);
          res.redirect('/index');
        });
      }
    //  req.flash('error','Invalid email or password');
      return res.status(422).render('auth/login',{
        errorMessage: 'Invalid email or password',
        oldInput:{
          email:email,
          password:password
        }
      });
    }).catch(err =>{
      console.log(err);
      res.redirect('/login');
    });
  }).catch(err => console.log(err));
};

exports.getSignup = (req, res, next) =>{
  let message = req.flash('error');
  if (message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup',{
    errorMessage: message,
    oldInput:{
      email:'',
      password:'',
      confirmPassword:''
    },
  });

};

exports.postSignup = (req, res, next) =>{
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // iska mtlb yeh hai ke agr error isEmpty nhi hai toh validation fail ho gae or status code send kare ge validtion fail ho gae hai
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    console.log(errors.array()[0].msg);
    return res.status(422).render('auth/signup', {
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email:email,
        password:password,
        confirmPassword: confirmPassword
      }
    });
  }


  bcrypt.hash(password, 12)
  .then(hashedPassword =>{
    const user = new User({
      email: email,
      password: hashedPassword,
      Post: { years:[] }
    });
    return user.save();
  }).then(result =>{
    console.log('You have sucessfully signup');
    return res.redirect('/login');

  })
  .catch(err =>{
    console.log(err);
  });
};

exports.postLogut= (req,res,next)=>{
  req.session.destroy();
  res.redirect('/');
};
