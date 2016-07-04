const Route = require('./route');
const SubRoute = require('./sub_route')

class ResourceRoute{

  constructor(ctrl, options){
    this.ctrl = ctrl;
    this.options = options;
    this.options['id'] = this.options['id'] || 'id';
    this.name =  options['name'] || ctrl.name.toLowerCase();

    if(options['parent']){
      this.parent_path = this.parents().map((r) => {  return `${r.name}/:${r.name}_id` }).join('/')
    }
  }

  parents(){
    var resource = this.options['parent']
    var _parents = [resource]
  
    while(resource = resource.options['parent']){
      _parents.unshift(resource)
    }

    return _parents
  }
 
  get actions(){
    return { 
      index:   { http_verb: 'GET',   path: (name, id) => { return name } },
      create:  { http_verb: 'POST',  path: (name, id) => { return name } },
      new:     { http_verb: 'GET',   path: (name, id) => { return `${name}/new` } },
      show:    { http_verb: 'GET',   path: (name, id) => { return `${name}/:${id}` } },
      edit:    { http_verb: 'GET',   path: (name, id) => { return `${name}/:${id}/edit` } },
      update:  { http_verb: 'PUT',   path: (name, id) => { return `${name}/:${id}` } },
      destroy: { http_verb:'DELETE', path: (name, id) => { return `${name}/:${id}` } }
    }
  }

  selectActions(actions, only){
    for(let action in actions){
      if(only.indexOf(action) == -1){
        delete actions[action];
      }
    }
  }

  rejectActions(actions, except){
    except.forEach((action) => {
      delete actions[action]
    });
  }

  get resourceUrl(){
    if(!this._resourceUrl){
      this._resourceUrl = [ this.route_builder.mount_path, this.parent_path, this.name].join('/')
    }

    return this._resourceUrl
  }

  generate(){
    var routes = [], 
        options = this.options, 
        actions = this.actions 

    if(options['only'] ){
      this.selectActions(actions, options['only'])
    }else if(options['except']){
      this.rejectActions(actions, options['except'])
    }

    for(let action in actions){
      let actionOpts = actions[action] 
      let route = new Route({ 
          url: actionOpts.path(this.resourceUrl, options.id),
          ctrl: this.ctrl,
          action: action,
          http_verb: actionOpts.http_verb,
          prefix: this.prefix 
        })

      routes.push(route)
    } 

    return routes;
  }

  resource(ctrl, options = {}){
    options['parent'] = this
    return this.route_builder.resource(ctrl, options)
  }

  get member(){
    if(!this._member){
      this._member = new SubRoute('member', this)
    }

    return this._member
  }

  get collection(){
    if(!this._collection){
      this._collection = new SubRoute('collection', this)
    }

    return this._collection
  }
}

module.exports = ResourceRoute;
