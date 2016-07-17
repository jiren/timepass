# Timepass
It is a Node.js 6(ES6) web framework (Work in progress)

## How to create a first application

- Install npm package.

`npm install timepass`

```javascript
const Timepass = require('Timepass')
const App = new Timepass() // new Timepass({"port": 5000})

class UsersController extends Timepass.Controller{

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
}
// Before actions
UsersController.beforeAction('auth')
  
App.defineRoutes(function(r){
  r.root(UsersController, 'index')
  r.resource(UsersController).resource(Orders)
  //r.resource(Users, { id: 'user_id', only: ['new', 'create']})
  //r.resource(Users, { id: 'user_id', except: ['new', 'create']}).resource(Orders)
})

// Start server on default port 3000
TestApp.start()
```

## Status
Timepass is under  development, and its design is still in flux . 

## TODO

Here are some of the baisc things need to be developed

- [ ] App Configuration options with diffrent envs : test, development, production
- [ ] View Rendering
- [ ] Session Management
- [ ] Middlewares : Request with file, etag, session
- [ ] Request body encoding/decoding, gzip compression
- [ ] Error Pages 404, 500 etc
- [ ] Logger
- [ ] Route paths methods: user_path, edit_user_path(1)
- [ ] View Layout
- [ ] Static Pages
- [ ] Asset Managment
- AND MANY MORE THINGS
