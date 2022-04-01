var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const keysecret = 'Login'

app.use(cors())
const mysql = require('mysql2');
//create connec to database mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
  });

app.post('/register', jsonParser, function (req, res, next) {
  //encrpt password to hash
  bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
     connection.execute(
        'INSERT INTO users (email, password, fname, llname) VALUES (?, ?, ?, ?)',
        [req.body.email, hash, req.body.fname, req.body.llname],
        function(err, results, fields) {
          if(err){
              res.json({status:'error',message: err})
              return
          }
          res.json({status:'ok'})
        }
      );
  });
})

app.post('/login', jsonParser, function (req, res, next) {
  connection.execute(
    'SELECT * FROM users WHERE email=?',
    [req.body.email],
    function(err, users, fields) {
      if (err) {res.json({status:'error',message: err});return}
      if (users.legth==0){res.json({status:'error',message: 'no user found'});return}
     //load hash from your password DB
      bcrypt.compare(req.body.password, users[0].password,function(err,islogin) {
        if(islogin){
    //generate token for user login
          var token = jwt.sign({ email:users[0].email }, keysecret);
          res.json({status:'ok',message:'login success',token})
        }
        else{
          res.json({status:'error',message:'login failed'})
        }
    });     
    }
  );
})

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})