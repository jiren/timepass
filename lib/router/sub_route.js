
class SubRoute{
  constructor(type, resource){
    this.resource = resource
    this.route_builder = resource.route_builder
    this.type = type
  }

  get(url, action){
    this.add(url, action, 'GET')
  }
  
  post(url, action){
    this.add(url, action, 'POST')
  }

  put(url, action){
    this.add(url, action, 'PUT')
  }

  destroy(url, action){
    this.add(url, action, 'DELETE')
  }

  add(url, action, http_verb){
    var _url,
        _action = action || url.replace(/^\//, '').split('/')[0]
    
    if(this.type == 'member'){
       _url = `/${this.resource.resourceUrl}/:${this.resource.name}_id/${url}`
    } else if(this.type == 'collection'){
       _url = `/${this.resource.resourceUrl}/${url}`
    }
    
    this.route_builder._add(_url, this.resource.ctrl, _action, http_verb)
  }
}

module.exports = SubRoute
