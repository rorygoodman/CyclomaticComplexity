const git = require("nodegit");
const http = require('http');
const fs = require("fs");
const util = require("util");
const request=require('request');
const bp = require('body-parser');
const express = require('express');
var repo = "https://github.com/haltu/muuri.git";
var slave = express();
// parse application/x-www-form-urlencoded
slave.use(bp.urlencoded({ extended: false }))

// parse application/json
slave.use(bp.json())
var workerNo=-1;
function work(req,res){
	console.log(req.body);
}
slave.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
  console.log("hi");
})
request('http://localhost:3000/new', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  workerNo=JSON.parse(body).workerNo;
	port=JSON.parse(body).port; 
	slave.listen(port);// Print the HTML for the Google homepage.
});
request.post({url:'http://localhost:3000//work', form:  {'workerNo':workerNo}}, function(err,httpResponse,body){
	console.log("yo");
});


