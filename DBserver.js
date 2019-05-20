const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');

// parse application/json
app.use(bodyParser.json());

//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'by19940320',
  database: 'world_cities'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/country',(req, res) => {
  let sql = "SELECT DISTINCT country FROM location ORDER BY country";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/country/:id',(req, res) => {
  let sql = "SELECT city FROM location WHERE country=\'" + req.params.id + "\' ORDER BY city";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.get('/country/:id/:cid', (req, res) => {
  let sql = "SELECT latitude, longitude FROM location WHERE city=\'" + req.params.cid + "\' and country=\'" + req.params.id + '\'';
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

app.listen(3001,() =>{
  console.log('Server started on port 3000...');
});
