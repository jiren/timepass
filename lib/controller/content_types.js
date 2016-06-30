
const ContentTypes = {
  types: {
    'application/x-www-form-urlencoded': 'text/html',
    'application/json': 'json'
  },

  json: 'application/json',
  default: 'text/plain',

  get(type){
    return this.types[type] || this.default;
  }
}

module.exports = ContentTypes
