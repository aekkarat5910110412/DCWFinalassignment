var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors())
const mysql = require('mysql2');
//create connec to database mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
  });

app.post('/register', jsonParser, function (req, res, next) {
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

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})