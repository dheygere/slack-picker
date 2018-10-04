const parse = require('urlencoded-body-parser')

module.exports = async request => {
  const data = await parse(request);
  return "Test " + data.text
}
