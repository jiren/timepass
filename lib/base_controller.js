
class BaseController{
   constructor(app, request, response, params){
    this.app = app;
    this.request = request;
    this.response = response;
    this.params = params || {};
  }

  render(data, type = 'html'){
    this.response.statusCode = 200;
    this.response.setHeader('Content-Type', 'text/plain');
    this.response.end(data);
  }
 
}

module.exports = BaseController;
