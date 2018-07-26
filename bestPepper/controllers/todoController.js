const express = require('express');
const session = require('express-session');
module.exports = function(app, db, passport) {
  // reading data
app.get('/', isLoggedIn, function(req, res) {
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
 successRedirect: '/',
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
  successRedirect: '/',
  failureRedirect: '/signin'}
 )
);
//destroy sessopm
app.get('/logout',function(req,res){
    console.log("Logout")
    req.session.destroy(function(err) {
    res.redirect('/signin');
    });

  });

  // display purchasepage

  app.get('/ConfirmPurchase', isLoggedIn, function (req, res) {
    var sessData = req.session;
    sessData.user = req.user;
    console.log(sessData.user);
    console.log('we reading');
    console.log(req.user);
    let sql = 'SELECT * FROM options;';
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log(results);
      res.render('purchaseTemplate', {options: results, user:req.user} );
    });
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


  app.post('/addOptions', function (req, res) {
       console.log(req.body);
       let sql = 'INSERT INTO options (imageLink, style, ppsf, name) VALUES("' + req.body.imageLink + '", "' + req.body.style + '"," '+  req.body.ppsf + '"," ' + req.body.name + '");';
       console.log(sql);
       db.query(sql, (err, results) => {
         if (err) throw err;
         // console.log(results);
         res.render('admin', {todos: results});
       });
     });
     app.get('/profile/:id',function(req, res) {
         console.log('get2datprofile');
         var theUser = req.session.user;

         let sql =`SELECT * FROM users WHERE id = ${req.params.id};`;
         db.query(sql, theUser, (err, result) => {
           if (err) throw err;
           var sessData = req.session;
           sessData.option = result;
           info = sessData.option
           console.log(theUser);
           console.log(info);
           res.render('purchaseTemplate', {option: info, theUser: theUser}); //CODE!!!!!!!!!!!!!!!!!!!!!!!
         });
       });

       app.post('/select', isLoggedIn, function (req, res) {
      console.log("+++++++++++++++++++++++++++++++++++++++++++++");
        var theUser = req.session.user;
        console.log(theUser);
      let w = req.body.width;
      let h = req.body.height;
      var sessData = req.session;
      console.log(sessData.option[0].ppsf);
      var price = ((w/12)*(h/12))*sessData.option[0].ppsf;
      sessData.price = price
      console.log(sessData.price);
      let sql = `SELECT * FROM contractors;`
      db.query(sql, (err, result)=>{
        console.log(result);
        res.render ('select', {contractors:result, option: sessData.option, theUser:theUser, price})
      });
    });

    app.post('/checkout', isLoggedIn, function (req, res) {
      console.log("---------------------------");
      var sessData = req.session;

      console.log(sessData.price);
      console.log(sessData.user);
      console.log(sessData.option[0]);
      console.log(req.body.contractor);
      let sql = 'SELECT * FROM contractors WHERE id = "' + req.body.contractor +'";';
      console.log(sql);
      db.query(sql, (err, result)=> {
        console.log(result);
        sessData.contractor = result;
        res.render('checkout', {price:sessData.price, user: sessData.user, option:sessData.option[0], contractor: sessData.contractor  })

      })
    });

    app.post('/buy', function (req, res) {
  console.log("BUYING+++++++++=====================");
  var sessData = req.session;
  console.log(req.body.address);
  sessData.address = req.body.address;
  console.log(sessData.price);
  console.log(sessData.user);
  console.log(sessData.option[0]);
  console.log(sessData.contractor);
  let sql = `INSERT INTO orders (userID, optionName, contractorName, price, address) VALUES (`+ sessData.user.id +`, "`+sessData.option[0].name+ `","`+sessData.contractor[0].name+`",`+sessData.price+`, "${req.body.address}");`;
  console.log(sql);
  db.query(sql, (err, result)=> {
    console.log(sessData.allOptions);
    console.log(result);

    res.redirect('/orders')
  })
})

app.get('/treatment-/:id',function(req, res) {
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
        res.render('SignedOutpurchaseTemplate', {option: info, theUser: theUser}); //CODE!!!!!!!!!!!!!!!!!!!!!!!
      });
    });

    // MY NEW CODE


    app.post('/addOptions', function (req, res) {
         console.log(req.body);
         let sql = 'INSERT INTO options (imageLink, style, ppsf, name) VALUES("' + req.body.imageLink + '", "' + req.body.style + '"," '+  req.body.ppsf + '"," ' + req.body.name + '");';
         console.log(sql);
         db.query(sql, (err, results) => {
           if (err) throw err;
           // console.log(results);
           res.render('admin', {todos: results});
         });
       });
       app.get('/profile/:id',function(req, res) {
           console.log('get2datprofile');
           var theUser = req.session.user;

           let sql =`SELECT * FROM users WHERE id = ${req.params.id};`;
           db.query(sql, theUser, (err, result) => {
             if (err) throw err;
             var sessData = req.session;
             sessData.option = result;
             info = sessData.option
             console.log(theUser);
             console.log(info);
             res.render('SignedOutpurchaseTemplate', {option: info, theUser: theUser}); //CODE!!!!!!!!!!!!!!!!!!!!!!!
           });
         });

         app.post('/select', isLoggedIn, function (req, res) {
        console.log("+++++++++++++++++++++++++++++++++++++++++++++");
          var theUser = req.session.user;
          console.log(theUser);
        let w = req.body.width;
        let h = req.body.height;
        var sessData = req.session;
        console.log(sessData.option[0].ppsf);
        var price = ((w/12)*(h/12))*sessData.option[0].ppsf;
        sessData.price = price
        console.log(sessData.price);
        let sql = `SELECT * FROM contractors;`
        db.query(sql, (err, result)=>{
          console.log(result);
          res.render ('select', {contractors:result, option: sessData.option, theUser:theUser, price})
        });
      });

      app.post('/checkout', isLoggedIn, function (req, res) {
        console.log("---------------------------");
        var sessData = req.session;

        console.log(sessData.price);
        console.log(sessData.user);
        console.log(sessData.option[0]);
        console.log(req.body.contractor);
        let sql = 'SELECT * FROM contractors WHERE id = "' + req.body.contractor +'";';
        console.log(sql);
        db.query(sql, (err, result)=> {
          console.log(result);
          sessData.contractor = result;
          res.render('checkout', {price:sessData.price, user: sessData.user, option:sessData.option[0], contractor: sessData.contractor  })

        })
      });


app.get('/orders', isLoggedIn, function (req, res) {
  var sessData = req.session;
  sessData.user = req.user;
  let sql = `SELECT * FROM orders WHERE userID = `+sessData.user.id + `;`;
  db.query(sql, (err, result)=> {
    console.log(result);
    res.render('orderPage', {user:sessData.user, orders:result})

  })
})

// app.get('/profile/:id', function(req, res) {
//   console.log("Let's get 2 dat profile boi!");
//   var UserProfile = req.session.user;
//
//   let sql = `SELECT * FROM users WHERE id = ${req.params.id};`;
//   db.query(sql, UserProfile, (err, result) => {
//     if (err) throw err;
//     // var sessData = req.session;
//     // sessData.option = result;
//     // info = sessData.option
//     console.log(UserProfile);
//     // console.log(info);
//     res.render('profileTemplate', {UserProfile: UserProfile});
//   });
// });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/signin');
}
