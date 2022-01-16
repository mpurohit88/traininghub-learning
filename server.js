const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

const fs = require('fs');

//express -> it's a framework, this allow us to build web server
//node js -> it's a environemnt, which allow you to run javascript
const app = express();

//midlleware
//application
app.use(bodyParser.json());

app.use(cors()); //allow everyone

//logging

const LoggerMiddleware = (req, res, next) => {
  console.log("route called: ", req.route.path);
  next();
}

// api default to send done message
app.get('/', LoggerMiddleware, (req, res) => {
  res.send("done");
})

// login api
app.post('/login', LoggerMiddleware, (req, res) => {
  console.log("login route body called")
  const output = fs.readFileSync('./registration.txt');
  const registeredUser = JSON.parse(output.toString());

  const loginData = req.body;

  if (loginData.userName === registeredUser.userName
    && loginData.password === registeredUser.password) {
    res.send(JSON.stringify({ message: "login success" }));
  } else {
    res.send(JSON.stringify({ message: "login failed" }));
  }
});

app.post('/registration', LoggerMiddleware, (req, res) => {
  // Save data
  try {
    fs.writeFileSync('./registration.txt', JSON.stringify(req.body).toString());

    res.status(200).send(JSON.stringify({ message: "registration success" }));
  } catch (ex) {
    console.log(ex);

    res.status(300).send(JSON.stringify({ message: "registration failed" }));
  }

});

// server is running on port 8080
app.listen('3001', () => console.log("Server is started"));
