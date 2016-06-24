const ResourceRoute = require('./resource_route');
const Route = require('./route');

class Router{
  constructor(app){
    this.app = app;
    this.routes = [];
  }

  get(url, ctrl, action){
    this._add(url, ctrl, action, 'GET');
  }
  
  post(url, ctrl, action){
    this._add(url, ctrl, action, 'POST');
  }

  put(url, ctrl, action){
    this._add(url, ctrl, action, 'PUT');
  }

  destroy(url, ctrl, action){
    this._add(url, ctrl, action, 'DELETE');
  }

  get restActions(){
    return { new: 'GET' , create: 'POST', show: 'GET', edit: 'GET', update: 'PUT', index: 'GET', destroy: 'DELETE'};
  }

  resource(ctrl, options = {}){
    var resourceRoute = new ResourceRoute(ctrl, options);

    resourceRoute.generate().forEach((route) => {
      this.routes.push(route);
    });
  }

  _add(url, ctrl, action, http_verb){
    var route = new Route({ url: url, ctrl: ctrl, action: action, http_verb: http_verb }); 
    this.routes.push(route);
  }

  define(callback){
    if((typeof callback) != 'function'){
       throw new Error('Router argument must be function.');
    }

    callback.call(this);
  }

  pageNotFound(response){
    response.statusCode = 404;
    response.setHeader('Content-Type', 'text/plain');
    response.end('Page not found');
  }

  findRoute(http_verb, url){
    var routes = this.routes, params;

    for(let i = 0, l = routes.length; i < l; i++){
      params = routes[i].match(http_verb, url);

      if(params){
        return { route: routes[i], params: params };
      }
    }

    return {};
  }

  handle(request, response){
    var { route, params } = this.findRoute(request.method, request.url);

    console.log(route, params)

    if(route){
      let ctrl = new route.ctrl(this.app, request, response, params);
      ctrl[route.action]();
    }else{
      this.pageNotFound(response);
    }
  } 

}

module.exports = Router;
