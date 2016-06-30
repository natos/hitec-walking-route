var fs   = require('fs');
var glob = require("glob");
var YAML = require('yamljs');


glob("content/*.yaml", function (err, files) {

  if (err) {
    throw(err);
  }

  var constantTemplate = "angular.module('App').constant('places', {});"
  var outputFilename = "src/PlacesConstant.js";
  var collection = [];
  var count = files.length;

  console.log('Building', outputFilename, 'with', files);

  files.forEach(function(file, i) {
    YAML.load(file, function(content) {
      push(content, i);
    });
  });

  function push(content, i) {
    collection.push(content);
    done(i);
  }

  function done(i) {
    if (i === count-1) {
      fs.writeFile(outputFilename, constantTemplate.replace('{}', JSON.stringify(collection, null, 4)), wrote);
    }
  }

  function wrote(err) {
    if(err) {
      throw(err);
    } else {
      console.log("Content generated in", outputFilename);
    }
  }

});
