const fs = require('fs')
const path = require('path')
const _ = require('lodash')

 var arr3=[]

 module.exports = {

 parseFile:function (filePath) {
  let content
  let output = new Promise((resolve, reject) => {
    fs.readFile(filePath,'utf-8', function(err, data) {
    if (err) reject( err )
    content = data.toString().split(/(?:\r\n|\r|\n)/g).map(function(line) {
      return line.trim()
    }).filter(Boolean)
    resolve((content))
  })
})
  return output
},

try2:async function(){
    console.log('start................................................');
// if  (require.main === module) {
    let dir = path.join(__dirname, './local')
    console.log(dir);
    let files = await fs.readdirSync(dir) // gives all the files
    let promises = await files.map(file => module.exports.parseFile(path.join(dir, file))) // gives an array of promises for each file
    return await Promise.all(promises)

  

//   }
}

 }
//  async function main2() {
//     let abc = await module.exports.try2();
//     console.log(abc);

//   }
//   main2()


