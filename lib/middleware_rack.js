const BodyParser = require('./middlewares/body_parser')


class MiddlewareRack{

  constructor(router){
    this.stack = []
    this.router = router 
    this.use(BodyParser)
  }

  use(klass, options = {}){
    var index = options['index']
    
    delete options.index

    if(index){
      this.stack.splice(index, 0, new klass(this.app, options))
    }else{
      this.stack.push(new klass(this.app, options))
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

module.exports = MiddlewareRack
