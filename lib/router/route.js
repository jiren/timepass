
const URL_CLEANER_REGX = /\/$/; 
const PARAM_REGX_STR = "([^/]+?)"

class Route{

  constructor({ http_verb: http_verb, url: url, ctrl: ctrl, action: action }){
    this.url = url;
    this.http_verb = http_verb;
    this.ctrl = ctrl;
    this.action = action;
    this.params = this.findParams(this.url);
    this.regx = this.buildRegx(url, this.params); 
  }

  match(http_verb, url){
    if(http_verb != this.http_verb){
      return false;
    }

    var result  = this.regx.exec(url);

    if(!result){
      return false;
    }

    var path_params = {};

    if(this.params){
      this.params.forEach((param, i) => {
        path_params[param] = result[i+1]
      })
    }  
     
    return path_params;
  }

  findParams(url){
    var params = url.split('/').reduce((params, path) => {
      if(path[0] == ':'){
        params.push(path.replace(':', ''))
      }
      return params
    }, []);

    return params.length ? params : undefined;
  }

  buildRegx(url, params){
    var regx_str = url;

    if(params){
      params.forEach((param) => {
        regx_str = regx_str.replace(`:${param}`, PARAM_REGX_STR);
      })
    }

    return new RegExp('^' + regx_str + '/*?$', 'i');
  }
}

module.exports = Route;
