const url = require('url')

module.exports = async request => {
  const query = url.parse(request, true).query
  return 'Youpi ' + query.text
}
