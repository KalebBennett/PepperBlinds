const express = require('express');
const session = require('express-session');
module.exports = function(app, db, passport) {
  // reading data
app.get('/todo', isLoggedIn, function(req, res) {
  var sessData = req.session;
  sessData.user = req.user;
  console.log(sessData.user);
   console.log('we reading');
   console.log(req.user);
   let sql = 'SELECT * FROM options;';
   db.query(sql, (err, results) => {
     if (err) throw err;
     console.log(results);
     res.render('todo', {options: results, user:req.user} );
   });
 });

  // posting data
  app.post('/todo', function(req, res){
    console.log('we posting');
    let item = req.body;
    console.log(item);
    item['userID'] = req.user.id;
    let sql = 'INSERT INTO todoItems SET ?';
    let query = db.query(sql, item, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    });
  });

  // destroying data
  app.delete('/todo/:id', function(req, res) {
    console.log('we deleting');
    let sql =`DELETE FROM todoItems WHERE id = ${req.params.id};`;
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.json(result);
    });
  });

  // display sign up

  app.get('/signup', function (req, res) {
    res.render('signup', {message: req.flash('signupmessage')});
  });
// handling signup form
  app.post('/signup', passport.authenticate('local-signup',  {
     successRedirect: '/todo',
     failureRedirect: '/signup'}
    )
  );

  //displaying sign in
  app.get('/signin', function(req,res){
    console.log('we reading');
    let sql = 'SELECT * FROM options;';
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.render('signin',  {message: req.flash('loginMessage'),options:results});
    });
   });

   // halding sign in form

   app.post('/signin', passport.authenticate('local-signin',  {
      successRedirect: '/todo',
      failureRedirect: '/signin'}
     )
   );
   //destroy sessopm
   app.get('/logout',function(req,res){

        req.session.destroy(function(err) {
        res.redirect('/signin');
        });

      });

      // display purchasepage

      app.get('/ConfirmPurchase', function (req, res) {
        res.render('purchaseTemplate');
      });

      app.get('/admin', function(req, res) {
      res.render('admin')
    })

    app.get('/treatment/:id',function(req, res) {
        console.log('we be getting');
        var theUser = req.session.user;

        let sql =`SELECT * FROM options WHERE id = ${req.params.id};`;
        db.query(sql, theUser, (err, result) => {
          if (err) throw err;
          var sessData = req.session;
          sessData.option = result;
          info = sessData.option
          console.log(theUser);
          console.log(info );
          res.render('purchaseTemplate', {option: info, theUser: theUser}); //CODE!!!!!!!!!!!!!!!!!!!!!!!
        });
      });

      // MY NEW CODE

      app.post('/select', function (req, res) {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        console.log(req.body.width * req.body.height);
        var sessData = req.session;
        console.log(sessData.option);
      })










};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/signin');
}
