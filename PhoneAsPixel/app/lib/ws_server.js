var http = require('http');

http.createServer(function(request, response){

    //The following code will print out the incoming request text
    request.pipe(response);

}).listen(8080, '127.0.0.1');

console.log('Listening on port 8080...');
