/**
 * Created by jin on 2017/6/18.
 */

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const falsh = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const database = require('./config/database');

// connect to mongoDB
mongoose.connect(database.mongo);
let db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
});
db.on('open', () => {
  console.log('connect on Mongo db, on port 27017...');
});

// bring in Article Model
let Article = require('./models/articles.js');

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// use the express session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// use the express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// use the express validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;
    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

// Get -> return the index page for root
app.get('/', function (req, res) {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'article no1',
        articles: articles
      })
    }
  });
});

// any route to /articles will go to the articles routes
let articles = require('./routes/articles.js');
let users = require('./routes/users.js');
app.use('/articles', articles);
app.use('/users', users);

// listen on port 3000
app.listen(3000, function (req, res) {
  console.log('Server is running on port 3000...');
});