const git = require("nodegit");
const http = require('http');
const fs = require("fs");
const util = require("util");
const request=require('request');
const bp = require('body-parser');
const express = require('express');
const escomplex = require ('escomplex');
var slave = express();
var path="";
slave.use(bp.urlencoded({ extended: false }))


slave.use(bp.json())
var workerNo=-1;
slave.post('/',function (req, res) { 
    console.log('Examining file: ' + req.body.fileNo );
    if(req.body.file!="done"){
      if(!fs.existsSync(req.body.file)){
      console.log("file doesn't exist");
      request.post('http://localhost:3000/more', {form:{"workerNo":workerNo,"fileNo":req.body.fileNo,"result": -1}});
      }
      else{
        var fileString=fs.readFileSync(req.body.file, 'utf8');
        var report=escomplex.analyse(fileString);
        request.post('http://localhost:3000/more', {form:{"workerNo":workerNo,"fileNo":req.body.fileNo,"result": report.aggregate.cyclomatic}});
      }
    }
    else{
      console.log("No more files. Good work. Here's your shiny penny.")
    }
    

})

request('http://localhost:3000/new', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  workerNo=JSON.parse(body).workerNo;
	port=JSON.parse(body).port; 
  console.log(port);
	slave.listen(port);
});






