const Url = require('url')
const Querystring = require('querystring')
const ResourceRoute = require('./resource_route')
const Route = require('./route')

class Router{
  constructor(app){
    this.app = app
    this.routes = []
  }

  get(url, ctrl, action){
    this._add(url, ctrl, action, 'GET')
  }
  
  post(url, ctrl, action){
    this._add(url, ctrl, action, 'POST')
  }

  put(url, ctrl, action){
    this._add(url, ctrl, action, 'PUT')
  }

  destroy(url, ctrl, action){
    this._add(url, ctrl, action, 'DELETE')
  }

  root(ctrl, action){
    this._add('/', ctrl, action, 'GET')
  }

  get restActions(){
    return { new: 'GET' , create: 'POST', show: 'GET', edit: 'GET', update: 'PUT', index: 'GET', destroy: 'DELETE'}
  }

  resource(ctrl, options = {}){
    var resourceRoute = new ResourceRoute(ctrl, options)

    resourceRoute.generate().forEach((route) => {
      this.routes.push(route)
    })
  }

  _add(url, ctrl, action, http_verb){
    var route = new Route({ url: url, ctrl: ctrl, action: action, http_verb: http_verb }) 
    this.routes.push(route)
  }

  define(callback){
    if((typeof callback) != 'function'){
       throw new Error('Router argument must be function.')
    }

    callback.call(this)
  }

  pageNotFound(res){
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/plain')
    res.end('Page not found')
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
    var url = Url.parse(req.url)
    var { route, params } = this.findRoute(req.method, url.pathname)

    if(url.query){
      params = Object.assign(Querystring.parse(url.query), params)
    }

    if(req.body){
      params[route.ctrl_name] = req.body
    }

    req.params = params
    route ? route.call(this.app, req, res) : this.pageNotFound(res)
  } 

}

module.exports = Router
