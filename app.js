const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const abc = require('lodash');
const _ = require('underscore');
const moment = require('moment');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const  User = require('./models/user');

const MONGODB_URI="mongodb+srv://taha:taha155@cluster0.vpjut.mongodb.net/shop?";

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();
// multer apka basically file ko upload krne ke leye istemal hota hai

// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const fileStorage = multer.diskStorage({ // or jo yeh diskStorage hai woh path define krta hai mtlb ke kaha apko image store krne hai mene image ke name se aik folder bnaya hai or waha store kr raha hun
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => { // or isme filename ke sath uski date btae hai mtlb agr me file store kr raha hun toh name ke sath date bhi store karo ga keh is date ko yeh file upload hue hai
    cb(null, Date.now()+ '-' + file.originalname);
  }
});

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/; // yeh check kr raha hai srf yehe type ke file acceptable hai iseke ellawa koi or nhi hai
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // yeh check kar raha hai extension ke jo file hai usek jpeg ya png ya gif se mil rahe hai agr mil rahe hoge toh its mean succefful ho gaya hai woh
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}


app.use(flash());

app.set('view engine', 'ejs');

const frontRoutes = require('./routes/nonUser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));


app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({ storage:fileStorage , fileFilter:function(req, file, cb){
    checkFileType(file, cb);
  }}).single('blogImage'));
// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).single('blogImage')
// );

app.use(express.static("public"));
//app.use(express.static("images")); // first method hai ke hum static ke zarye file server kr rahai han or bta rahai han ke is folder me images hai use server karo but woh error de raha hai q ke woh samjh raha hai ke root file hai  isko overcome krne ke leye hum yeh kare ge
app.use('/images',express.static('images')); // is tarha hum server kare ge btade ge yeh hai images me jo phir serve karo  "/images" use for static serveing
app.use(
  // yeh session function hai "my secret aik basically id hai", "resave:false" iska mtlb session will not be save on every request that is done son no every respose that is sent bss aik mrtuba jo jae ga save her request pe nhi hoga
  // or joh yeh store hai yaha hum save kr rahai han session
  session({
    secret: 'my secret',//The secret is used to hash the session with HMAC: The session is then protected against session hijacking by checking the fingerprint against the hash with the secret:
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  // agr session nhi hai toh dosre midleware pe chale jao
  //agr "session" hai toh user wale ko exexute karo
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});
// this allow to set local variables that are passesd into the views local simpley becauese while they will only exist in the views which are render
// yeh jo keya hai authentication ke wajha se keya hai
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(frontRoutes);
app.use(authRoutes);
app.use(userRoutes);


mongoose.connect(MONGODB_URI).then(result =>{
  app.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port 3000");
  });
}).catch(err =>{
  console.log(err);
});

// is tarha bhi kr sakte han but local host access karo ge toh is tarha likhna "https://localhost:3000" ise chale ga q ke hum ssl connection bhi use kr rahai han

// mongoose.connect(MONGODB_URI).then(result =>{
//   https.createServer({key: privateKey, cert:certificate},app).listen(process.env.PORT || 3000, function() {
//     console.log("Server started on port 3000");
//   });
// }).catch(err =>{
//   console.log(err);
// });
