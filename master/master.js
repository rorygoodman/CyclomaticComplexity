const git = require("nodegit");
const http = require('http');
const fs = require("fs");
const formidable = require("formidable");
const util = require("util");
const request=require('request');
var newPort = 3001
var numWorkers=0;
const bp = require('body-parser');
const express = require('express');

var master = express();
// parse application/x-www-form-urlencoded
master.use(bp.json())
master.use(bp.urlencoded({ extended: true }))

// parse application/json


master.get('/new',function (req, res) {
  console.log("worker "+numWorkers+" connected" );
    var data = {"workerNo": numWorkers,
                "port": newPort};
    newPort++;
    numWorkers++;
    res.send(data);
})
master.get('/work',function (req, res) {
   console.log(JSON.parse(req.body).workerNo +" wants work"); 
   res.send("hi");
})

master.listen(3000);

