"use strict";

if (process.argv.length != 3) {
  console.log("Need only one positional argument for backend domain and port.");
  process.exit(1);
}

let path = require("path");
let express = require("express");
let session = require("express-session");
let bodyParser = require("body-parser");

let app = express();
app.use(express.static(path.join(__dirname, "../")));
app.store = session({
  name: "session",
  secret: "somesecretstring",
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: "/"
  }
});
app.use(app.store);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.backend = process.argv[2];

require('./virtual')(app);

let server = app.listen(8080, () => {
  console.log(`Frontend Listening on Port: ${server.address().port}`);
  console.log(`Communicating with '${process.argv[2]}'...`);
});