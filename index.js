const url = require('url')

module.exports = async request => {
  const query = url.parse(request.url, true).query

  if (!query.text) {
    return 'giff me, argument!'
  }

  return 'Youpi ' + query.text
}
