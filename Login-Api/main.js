var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const keysecret = 'Login'
const winston = require('winston');
const expressWinston = require('express-winston');

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

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
          var token = jwt.sign({ email:users[0].email }, keysecret,{ expiresIn: '1h' });
          res.json({status:'ok',message:'login success',token})
        }
        else{
          res.json({status:'error',message:'login failed'})
        }
    });     
    }
  );
})
app.post('/authen', jsonParser, function (req, res, next) {
  try{
    const token = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(token, keysecret);
    res.json({status:'ok',decoded})
  }catch(err){
    res.json({status:'error',message:err.message})
  }  
})
//appEmployee
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  database: "employeeSystem",
});

app.get("/employees", (req, res) => {
    db.query("SELECT * FROM employees", (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const country = req.body.country;
  const position = req.body.position;
  const wage = req.body.wage;

  db.query(
    "INSERT INTO employees (name, age, country, position, wage) VALUES (?,?,?,?,?)",
    [name, age, country, position, wage],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.put("/update", (req, res) => {
  const id = req.body.id;
  const wage = req.body.wage;
  db.query(
    "UPDATE employees SET wage = ? WHERE id = ?",
    [wage, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM employees WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


app.listen(3333, function () {
  console.log('CORS-enabled web server listening on port 3333')
})