
/*
   groups GET      /groups(.:format)                                                 groups#index
          POST     /groups(.:format)                                                 groups#create
  new_group GET    /groups/new(.:format)                                             groups#new
  edit_group GET   /groups/:id/edit(.:format)                                        groups#edit
    group GET      /groups/:id(.:format)                                             groups#show
          PATCH    /groups/:id(.:format)                                             groups#update
          PUT      /groups/:id(.:format)                                             groups#update
          DELETE   /groups/:id(.:format)                                             groups#destroy
*/

const Route = require('./route');

class ResourceRoute{

  constructor(ctrl, options){
    this.ctrl = ctrl;
    this.options = options;
    this.options['id'] = this.options['id'] || 'id';
    this.name =  options['name'] || ctrl.name.toLowerCase();
  }

  get actions(){
    return { 
      index:   { http_verb: 'GET',   path: (name, id) => { return `/${name}` } },
      create:  { http_verb: 'POST',  path: (name, id) => { return `/${name}` } },
      new:     { http_verb: 'GET',   path: (name, id) => { return `/${name}/new` } },
      show:    { http_verb: 'GET',   path: (name, id) => { return `/${name}/:${id}` } },
      edit:    { http_verb: 'GET',   path: (name, id) => { return `/${name}/:${id}/edit` } },
      update:  { http_verb: 'PUT',   path: (name, id) => { return `/${name}/:${id}` } },
      destroy: { http_verb:'DELETE', path: (name, id) => { return `/${name}/:${id}` } }
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
      delete actions[action];
    });
  }

  generate(){
    var routes = [], 
        options = this.options,
        actions = this.actions;

    if(options['only'] ){
      this.selectActions(actions, options['only']);
    }else if(options['except']){
      this.rejectActions(actions, options['except']);
    }

    for(let action in actions){
      let actionOpts = actions[action]; 
      let route = new Route({ 
          url: actionOpts.path(this.name, options.id), 
          ctrl: this.ctrl,
          action: action,
          http_verb: actionOpts.http_verb 
        })

      routes.push(route);
    } 

    return routes;
  }
  
}

module.exports = ResourceRoute;
