const url = require('url')

module.exports = async request => {
  const query = url.parse(request, true).query
  return `Query ${query} - ${request}`
}
