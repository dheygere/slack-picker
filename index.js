const url = require('url')
const {json} = require('micro');

module.exports = async request => {
  const data = await json(request);
//  console.log(data.text)

  return 'Youpi ' + data.text
}
