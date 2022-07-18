const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const _ = require("lodash");

module.exports = {
  parseFile: function (filePath) {
    let content;
    let output = new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", function (err, data) {
        if (err) reject(err);
        content = yaml.load(data);
        resolve(content);
      });
    });
    return output;
  },

  files: async function () {
    console.log("start..!");
    let dir = path.join(__dirname, "./local");
    let files = await fs.readdirSync(dir); // gives all the files

    let promises = await files.map((file) =>
      module.exports.parseFile(path.join(dir, file))
    ); // gives an array of promises for each file
    return [await Promise.all(promises), files];
  },
};

//  async function main2() {
//     let [abc, files] = await module.exports.try2();
//     console.log( 'bla bla :', files );
//    console.log( 'bla ok :', await abc );

//    return

//    const tk =yaml.dump(abc[0], {
//       styles: {
//         "!!null": "empty", // dump null as ~
//       },
//       forceQuotes: true,
//       sortKeys: true,
//    } )

//    console.log('tk :',typeof tk);

//   fs.writeFile(
//     "file4.yaml",
//     yaml.dump(abc[0], {
//       styles: {
//         "!!null": "empty", // dump null as ~
//       },
//       forceQuotes: true,
//       sortKeys: true,
//     }),
//     (error) => {
//       if (error) throw error;
//     }
//   );

//   }
// main2();
