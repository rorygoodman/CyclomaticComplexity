var git = require("nodegit");
var http = require('http');
var fs = require("fs");
var formidable = require("formidable");
var util = require("util");
var repo="";
function onRequest(request,response){
    console.log("user made request "+ request.toString())
    if(request.method=="GET"){
    	sendForm(response);
	}
	else if (request.method == "POST"){
		processForm(request,response);
	}
}

function sendForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}
function processForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        repo=fields.name;
        git.Clone(repo, "./tmp")        
        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end();
    });
}

http.createServer(onRequest).listen(8888, (err) =>{
	console.log("server running");
});
