var fs   = require('fs');
var glob = require("glob");
var minify = require('html-minifier').minify;

glob("src/*.html", function (err, files) {

  if (err) {
    throw(err);
  }

  var constantTemplate = "angular.module('App').run([\"$templateCache\", function($templateCache) { {{templateContent}} }]);"
  var outputFilename = "src/TemplatesCache.js";
  var collection = [];
  var count = files.length;

  files.forEach(function(file, i) {
    var content = fs.readFileSync(file, 'utf8');
    var mincontent = minify(content, {
      removeAttributeQuotes: true,
      removeOptionalTags: true,
      collapseWhitespace: true,
      processScripts: ['text/ng-template']
    });
    // mincontent.replace('{ \'', '{ \'');
    push('$templateCache.put("' + file + '", \'' + mincontent + '\')', i);
  });

  function push(content, i) {
    collection.push(content);
    done(i);
  }

  function done(i) {
    if (i === count-1) {
      // fs.writeFile(outputFilename, constantTemplate.replace('{{templateContent}}', JSON.stringify(collection, null, 4)), wrote);
      fs.writeFile(outputFilename, constantTemplate.replace('{{templateContent}}', collection.join(';\n')), wrote);
    }
  }

  function wrote(err) {
    if(err) {
      throw(err);
    } else {
      console.log("Templace Cache generated in", outputFilename);
    }
  }

});
