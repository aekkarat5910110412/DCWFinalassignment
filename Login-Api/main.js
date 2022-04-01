var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

app.use(cors())
const mysql = require('mysql2');
//create connec to database mysql
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'mydb'
  });

app.post('/register', jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO users (email, password, fname, llname) VALUES (?, ?, ?, ?)',
        [req.body.email, req.body.password, req.body.fname, req.body.llname],
        function(err, results, fields) {
          if(err){
              res.json({status:'error',message: err})
              return
          }
          res.json({status:'ok'})
        }
      );
  
})

app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})