
var Timepass = require('..');


var TestApp = new Timepass();

class Users extends Timepass.BaseController{

  index(){
    this.render('Users: This is INDEX page.')
  }

  show(){
    this.render(`Users: This is SHOW page for User  ${this.params.id}`)
  }

  new(){
    this.render('Users: This is NEW page.')
  }

  create(){
    this.render('Users: This is CREATE page.')
  }

  edit(){
    this.render(`Users: This is EDIT page. ${this.params.id}`)
  }

  update(){
    this.render(`Users: This is UPDATE page. ${this.params.id}`)
  }

  destroy(){
    this.render('Users: This is DESTROY page.')
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
