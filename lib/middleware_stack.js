const BodyParser = require('./middlewares/body_parser')

class MiddlewareStack{

  constructor(router){
    this.stack = []
    this.router = router 
    this.use(BodyParser)
  }

  use(klass, options = {}){
    var position = options['position']
    
    delete options.position

    if(position){
      this.stack.splice(index, 0, new klass(this.app, options))
    }else{
      this.stack.push(new klass(this.app, options))
    }
  }

  remove(...middlewares){
    for(let i in middlewares){
      let index = this.stack.indexOf(middlewares[i])

      if(index > -1){
        this.stack.splice(index, 1)
      }
    }
  }

  go(req, res){
    var index = 0, stack = this.stack, router = this.router

    req.originalUrl = req.url

    function next(){
      var middleware = stack[index++]

      if(!middleware){
        router.handle(req, res)
        return
      }
      
      middleware.call(req, res, next)
    }

    next()
  }
}

module.exports = MiddlewareStack
