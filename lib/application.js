const http = require('http');
const path = require('path');
const Util = require('./util');
const DEFAULTS = require('./defaults');
const RequestHandler = require('./request_handler');
const Router = require('./router');
const _BaseController = require('./base_controller');

class Application{

  constructor(options = {}){
    this.options = options;
    this.env = process.env.NODE_ENV || 'development';
    this.router = new Router(this);
  }

  start(){
    var hostname = this.options.hostname || DEFAULTS.hostname;
    var port = this.options.port || DEFAULTS.port;

    this.root = path.dirname(process.argv[1]);
    this.listen(hostname, port);
  }

  listen(hostname, port){
    var server = http.createServer(RequestHandler.handle);
    
    server.router = this.router;
    server.on('clientError', this.onHttpError);

    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }

  onHttpError(err, soket){
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  }

  defineRoutes(callback){
    if(typeof callback !== 'function'){
      throw new Error('Required function to define routes.')
    }

    callback.call(this.router);
  }

  static get BaseController(){
    return _BaseController;
  }

} 

module.exports = Application;
