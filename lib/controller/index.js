
const ContentTypes = require('./content_types');

class Controller{
   constructor(app, request, response){
    this.app = app
    this.request = request
    this.response = response
    this.params = request.params || {}
  }

  render(data, options = {}){
    var format = options['format'] || this.request.format

    this.response.statusCode = options['status'] || 200

    if(format == 'json'){
      data = JSON.stringify(data)
      this.setContentType(ContentTypes.json)
    }else{
      this.setContentType();
    }

    this.response.end(data)
  }

  redirectTo(path, statusCode = 302){
    this.response.statusCode = statusCode
    this.setHeader('Location', encodeURIComponent(path))
    this.response.end("TODO: Redirect content")
  }

  setHeader(name, value){
    this.response.setHeader(name, value)
  }

  setContentType(type){
    if(type || this.request.content_type){ 
      this.setHeader('Content-Type', type || ContentTypes.get(this.request.content_type.type))
    }
  }

}

module.exports = Controller
