
var Timepass = require('..');
var TestMiddleware = require('./test_middleware')
var TestApp = new Timepass();

TestApp.middleware.use(TestMiddleware)

class Users extends Timepass.Controller{
  
  index(){
    this.render('Users: This is INDEX page.')
  }

  show(){
    console.log(this.params)
    this.render(`Users: This is SHOW page for User  ${this.params.id}`)
  }

  new(){
    this.render('Users: This is NEW page.')
  }

  create(){
    this.render(this.params);
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

  auth(next){
    if(this.params.action == 'show'){
      return this.render('Auth fail', { status: 401 } )
    }

    console.log('Auth is done')
    next()
  }

  find_user(next){
    console.log('find_user', this.params)
    next()
  }

  find_users(next){
    console.log('find_users', this.params)
    next()
  }
}

Users.beforeAction('auth')
Users.beforeAction('find_user', {  except: ['new', 'index', 'create'] } )
     .beforeAction('find_users', { only: ['index'] } )

class Orders extends Timepass.Controller{

  index(){
    this.render('Orders: This is index page.')
  }

  edit(){
    this.render(`Users Order: This is EDIT page. ${this.params.id}`)
  }
}

console.log(Orders.beforeActions)

class Home extends Timepass.Controller{
  index(){
    this.render("This is Root Page");
  }

  dashboard(){
    this.redirectTo('/')
  }
}

class Address extends Timepass.Controller{
}

TestApp.defineRoutes(function(r){
  //this.get('/orders', Orders, 'index')
  r.root(Home, 'index')
  r.get('/dashboard', Home, 'dashboard');

  //r.resource(Users).resource(Orders).resource(Home).resource(Address, { only: ['index'] })
  //r.resource(Users).resource(Orders, (order) => {
  //  order.member.get('status')
  //  order.collection.get('zipcode')
  //})

  r.resource(Users).resource(Orders)

  r.resource(Address, (address) => {
      address.member.get('street')
      address.collection.get('zipcode', 'postalcode')
   })

  //r.resource(Users, { id: 'user_id', only: ['new', 'create']})
  //r.resource(Users, { id: 'user_id', except: ['new', 'create']}).resource(Orders)
})

//TestApp.defineRoutes('/admin', function(r){
//  r.resource(Users).resource(Orders)
//})
console.log(TestApp.router.toString());

TestApp.start()
