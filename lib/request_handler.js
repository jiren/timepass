const url = require('url');

var RequestHandler = {
  handle(request, response, callback){
    console.log("RequestHandler: " + request.url)
    
    var self = this, body = [];

    request.on('error', (err) => { 
      console.log(err) 
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      request.body = Buffer.concat(body).toString();
      self.router.handle(request, response)
    })
  }

}

module.exports = RequestHandler;
