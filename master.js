var git = require("nodegit");
var http = require('http');

function onRequest(request,response){
    console.log("user made request "+ request.toString())
    response.writeHead(200, {"Context-Type": "text/plain"});
    response.write("Hello World");
    response.end();
}
http.createServer(onRequest).listen(8888);
console.log("server running");

