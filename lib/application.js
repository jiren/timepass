const http = require('http')
const path = require('path')

const DEFAULTS = require('./defaults')
const Util = require('./util')
const MiddlewareRack = require('./middleware_rack')
const requestHandler = require('./request_handler')
const Router = require('./router')
const _Controller = require('./controller')

class Application{

  constructor(options = {}){
    this.options = options
    this.env = process.env.NODE_ENV || 'development'
    this.router = new Router(this)
    this.middleware_rack = new MiddlewareRack(this.router);
  }

  start(){
    var hostname = this.options.hostname || DEFAULTS.hostname
    var port = this.options.port || DEFAULTS.port

    this.root = path.dirname(process.argv[1])
    this.listen(hostname, port)
  }

  listen(hostname, port){
    var server = http.createServer(requestHandler)
    
    server.middleware_rack = this.middleware_rack
    server.on('clientError', this.onHttpError)

    server.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`)
    })
  }

  onHttpError(err, soket){
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  }

  defineRoutes(mount_path = '/', callback){
    if(arguments.length == 1){
      callback = mount_path
      mount_path = '/'
    }    

    if(typeof callback !== 'function'){
      throw new Error('Required function to define routes.')
    }

    this.router.defineRoutes(mount_path, callback)
  }

  static get Controller(){
    return _Controller
  }

} 

module.exports = Application
