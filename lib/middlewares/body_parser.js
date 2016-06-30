const TypeIs = require('type-is') 
const Qs = require('qs')
const ContentType = require('content-type')

const ReqTypes = ['json', 'urlencoded', 'multipart', 'text']

class BodyParser{
  constructor(app, options){
    this.app = app
  }

  parseBody(format, body){
    switch(format) {
      case 'urlencoded':
        return Qs.parse(body)
      case 'json':
        return JSON.parse(body)
      case 'multipart':
        throw new Error('implement multipart body parsing')
        break
      default:
        return false
    }
  }

  call(req, res, next){
    if(req.headers['content-type']){
      req.content_type = ContentType.parse(req)
    }

    req.format = TypeIs(req, ReqTypes)
    req.body = this.parseBody(req.format, req.body)

    next()
  }

}

module.exports = BodyParser
