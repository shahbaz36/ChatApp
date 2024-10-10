const express = require("express");
const fs = require("fs");

const app = express();

//To parse incoming request
app.use(express.json());

module.exports = app;
