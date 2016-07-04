class Route{

  constructor({ http_verb, url, ctrl, action, prefix }){
    this.url = url.replace(/\/{1,}/g, '/')
    this.http_verb = http_verb
    this.ctrl = ctrl
    this.action = action
    this.params = this.findParams(this.url)
    this.regx = this.buildRegx(this.url, this.params) 
    this.ctrl_name = ctrl.name.toLowerCase()
    this.prefix = prefix
  }

  match(http_verb, url){
    if(http_verb != this.http_verb){
      return false
    }

    var result  = this.regx.exec(url)

    if(!result){
      return false
    }

    var path_params = { controller: this.ctrl_name, action: this.action }

    if(this.params){
      this.params.forEach((param, i) => {
        path_params[param] = result[i+1]
      })
    }  
     
    return path_params
  }

  findParams(url){
    var params = url.split('/').reduce((params, path) => {
      if(path[0] == ':'){
        params.push(path.replace(':', ''))
      }
      return params
    }, [])

    return params.length ? params : undefined
  }

  buildRegx(url, params){
    var regx_str = url

    if(params){
      params.forEach((param) => {
        regx_str = regx_str.replace(`:${param}`, "([^/]+?)")
      })
    }

    return new RegExp('^' + regx_str + '/*?$', 'i')
  }

  call(app, req, res){
   (new this.ctrl(app, req, res))[this.action]()
  }

  toString(){
    var action_padding = ' '.repeat(Math.max(0, 60 - this.ctrl_name.length - this.action.length))

    return require('util').format('%s %s  %s', 
        this.http_verb + ' '.repeat(8 - this.http_verb.length), 
        this.ctrl_name + '#'+ this.action + action_padding,
        this.url)
  }

}

module.exports = Route
