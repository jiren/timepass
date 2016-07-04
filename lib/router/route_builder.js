const ResourceRoute = require('./resource_route')
const Route = require('./route')

class RouteBuilder{
  constructor(mount_path = '/'){
    this.mount_path = mount_path
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
    this.routes.push(new Route({ url: this.mount_path, ctrl: ctrl, action: action, http_verb: 'GET' }))
  }

  get restActions(){
    return { new: 'GET' , create: 'POST', show: 'GET', edit: 'GET', update: 'PUT', index: 'GET', destroy: 'DELETE'}
  }

  resource(ctrl, options = {}, sub_routes){
    if(arguments.length > 1 && typeof options === 'function'){
      sub_routes = options
      options = {}
    }

    var resourceRoute = new ResourceRoute(ctrl, options)

    resourceRoute.route_builder = this
    this.routes = [].concat(this.routes ,resourceRoute.generate())

    if(sub_routes){
      sub_routes(resourceRoute)
    }

    return resourceRoute
  }

  _add(url, ctrl, action, http_verb){
    this.routes.push(new Route({ url, ctrl, action, http_verb }))
  }
}

module.exports = RouteBuilder
