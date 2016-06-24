const url = require('url');

class RequestHandler{

  static handle(request, response, callback){
    console.log("RequestHandler: " + request.url)

    this.router.handle(request, response)
  }

}

module.exports = RequestHandler;
