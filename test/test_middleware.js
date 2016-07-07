
class TestMiddleware{
  constructor(app, options){
    this.app = app
  }

  call(req, res, next){
    console.log("***** TestMiddleware ********")
    next()
  }
}

module.exports = TestMiddleware 
