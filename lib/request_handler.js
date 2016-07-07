
const TRANS_ENCO = 'transfer-encoding'
const CONT_LEN = 'content-length'

function requestHandler(req, res, callback){
  var body

  req.on('error', (err) => { 
    console.log(err) 
  })

  if(req.headers[TRANS_ENCO] == undefined && isNaN(req.headers[CONT_LEN])){
    this.middleware_stack.go(req, res)
    return
  }

  body = []

  req.on('data', (chunk) => {
    body.push(chunk)
  })

  req.on('end', () => {
    req.body = Buffer.concat(body).toString();
 
    if(req.body){
      this.middleware_stack.go(req, res)
    }else{
      res.statusCode = 415
      res.end()
    }
  })
}

module.exports = requestHandler
