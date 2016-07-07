
function execBeforeActions(ctrl, action, before_actions){
  var index = 0

  function next(){
    var before_action = before_actions[index++]

      if(!before_action){
        return ctrl[action]()
      }

    ctrl[before_action](next)
  }

  next()
}


class BeforeActions{
  constructor(){
    this.stack = []
  }

  add(name, { only, except} = {}){
    if(!only && !except){
      return this.stack.push({ func: name, value: undefined })
    }

    var options = { only: {}, except: {} }

    if(only){
      only.forEach((a) => { options.only[a] = true })
    }
  
    if(except){
      except.forEach((a) => { options.except[a] = true })
    }

    this.stack.push({ func: name, value: options })
  }

  forAction(action){
    return this.stack.filter((o) => {
      if(o.value == undefined){ return o }

      if(o.value.only[action] || o.value.except[action] ==  undefined) {
        return o
      }
    })
  }

  call(ctrl, action){
    var index = 0, stack = this.forAction(action) 

    function next(){
      var options = stack[index++]

      if(!options){
        return ctrl[action]()
      }
  
      ctrl[options.func](next)
    }

    next()
  }
  
}

module.exports = BeforeActions;
