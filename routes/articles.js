const express = require('express');
const router = express.Router();
const Article = require('../models/articles.js');

// GET: add -> return view of add article
router.get('/add', function (req, res) {
  res.render('add_articles', {
    title: 'added articles'
  });
});

// POST: add -> add article from form
router.post('/add', (req, res) => {
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();
  let errors = req.validationErrors();
  if(errors){
    res.render('add_articles', {
      title: 'Added article',
      errors: errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save((err) => {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });
  }
});

// POST: edit -> edit the specific article
router.post('/edit/:id', (req, res) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;
  let query = {_id:req.params.id};
  Article.update(query,article,(err) => {
    if (err) {
      console.log(err);
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
  return;
});

// GET: edit -> return the edit view
router.get('/edit/:_id', (req, res) => {
  Article.findById(req.params._id, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      res.render('edit_article',{
        title: 'Edit article',
        article: article
      });
    }
  });
});

// GET: :id -> return the specific article view
router.get('/:_id', (req, res) => {
  Article.findById(req.params._id, (err, article) => {
    if (err) {
      console.log(err);
    } else {
      res.render('article',{
        article: article
      });
    }
  });
});

// DELETE: :id -> delete the specific article
router.delete('/:id',(req,res) => {
  let query = {_id : req.params.id};
  Article.remove(query,(err) => {
    if(err){
      console.log(err);
    } else {
      let article = {
        title: 'article one',
        author: 'wianr',
        body: 'this is article one'
      }
      res.send({
        message: 'success',
        article: article
      });
    }
  });
})

module.exports = router;