const Url = require('url')
const Querystring = require('querystring')
const RouteBuilder = require('./route_builder')

class Router{
  constructor(app){
    this.app = app
    this.routes = []
  }

  defineRoutes(mount_path, callback){
    var builder = new RouteBuilder(mount_path)

    callback(builder)
    this.routes = [].concat(this.routes, builder.routes)
  }

  pageNotFound(req, res){
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end(`Page not found for ${req.method} ${req.url}`)
  }

  findRoute(http_verb, url){
    var routes = this.routes, params

    for(let i = 0, l = routes.length; i < l; i++){
      params = routes[i].match(http_verb, url)

      if(params){
        return { route: routes[i], params: params }
      }
    }

    return {}
  }

  handle(req, res){
    var url = Url.parse(req.url), ctrl
    var { route, params } = this.findRoute(req.method, url.pathname)

    if(!route){
      return this.pageNotFound(req, res)
    }

    if(url.query){
      params = Object.assign(Querystring.parse(url.query), params)
    }

    if(req.body){
      params[route.ctrl_name] = req.body
    }

    req.params = params
    ctrl = new route.ctrl(this.app, req, res) 
    ctrl._call_action(route.action)
  } 

  toString(){
    return this.routes.map((r) => { return r.toString() } ).join('\n')
  }

}

module.exports = Router
