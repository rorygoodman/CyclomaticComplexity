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
const path = require('path');
var slavePorts = [];
var master = express();
var repo = "";
var workersToConnect=process.argv[2];
var repoFiles=[];
var numFiles=0;
var nextFile=0;

var complexities=[];
// parse application/x-www-form-urlencoded
master.use(bp.json())
master.use(bp.urlencoded({ extended: true }))

// parse application/json


master.get('/new',function (req, res) {
  console.log("worker "+numWorkers+" connected" );
    var data = {"workerNo": numWorkers,
                "port": newPort};
    slavePorts[numWorkers]=newPort;
    newPort++;
    numWorkers++;
    res.send(data);
    console.log(numWorkers);
    console.log(workersToConnect);

    if(numWorkers==workersToConnect){
        startWork();
    }
})
master.post('/more',function (req, res) {
  var worker=req.body.workerNo;
  var fileNo=req.body.fileNo;
  var result=req.body.result;
  console.log("worker "+worker+" analyzed file "+fileNo+" \n score: "+result)
  complexities[fileNo]=result;
  if(nextFile<repoFiles.length){
    request.post('http://localhost:'+slavePorts[worker], {form:{"file":repoFiles[nextFile],"fileNo":nextFile}});
    nextFile++;
  }
  else{
    request.post('http://localhost:'+slavePorts[worker], {form:{"file":"done"}});
    console.log("No more files for worker "+worker);
  }

  


});

function startWork(){
    repo = git.Clone('https://github.com/callumduffy/http-s-proxy.git', path.join(__dirname,'./repo-folder')).catch((error) =>{
        console.log('Repo already cloned or doesnt exist');
    }).then((repo) => {
    //get array of js files
    repoToArray(path.join(__dirname,'./repo-folder'), /\.js$/);
    console.log("Cloning done...ready to start calculating");
    console.log(repoFiles[nextFile]);
    for(var i=0;i<numWorkers&&i<repoFiles.length;i++){
        request.post('http://localhost:'+slavePorts[i], {form:{"file":repoFiles[nextFile],"fileNo":nextFile}});
        nextFile++;
    }
})};


function repoToArray(repoPath, fileType){
    var files = fs.readdirSync(repoPath);
    for (var i = 0; i < files.length; i++) {
      var file = path.join(repoPath, files[i]);
      var fileOrDir = fs.lstatSync(file);
      //check if a file or directory
      //if directory, recursion
      if(fileOrDir.isDirectory()){
        repoToArray(file,fileType);
      }
      else if(fileType.test(file)){
        repoFiles.push(file);
        numFiles++;
      }
    }

};

master.listen(3000);