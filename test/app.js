
var Timepass = require('..');


var TestApp = new Timepass();

class Users extends Timepass.BaseController{

  index(){
    this.render('Users: This is index page.')
  }

  show(){
    this.render(`Users: This is show page for User  ${this.params.id}`)
  }

}

class Orders extends Timepass.BaseController{

  index(){
    this.render('Orders: This is index page.')
  }

}

TestApp.defineRoutes(function(){
  this.get('/orders', Orders, 'index')
  this.resource(Users);

  //this.resource(Users, { id: 'user_id', only: ['new', 'create']})
  //this.resource(Users, { id: 'user_id', except: ['new', 'create']})
  console.log(this);
})


TestApp.start()


