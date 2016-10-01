'use strict';
var fs = require('fs'),
  path = require('path'),
  conf = {
    dataSourceFile: 'solutions.txt',
    dataTargetPath: 'data/',
    dataBestFile: 'best.dat',
    dataSolutionFile: 'solution.%n.dat',
    sourcePatten: /^(\d+)#(\d+) Best:\[(\d+)\] -> (\d+) = ([\d√^!+\-\*/\(\)]+)$/
  }, builder = {

    getFileContent: function (file) {
      var fileText = fs.readFileSync(file, {encoding: 'utf8'});
      return fileText.split(/[\n\r]+/);
    },

    saveFileContent: function (file, content) {
      fs.writeFileSync(file, content, {encoding: 'utf8'});
    },

    getSourceData: function () {
      var sourceArr = builder.getFileContent(conf.dataSourceFile),
        targetArr = [];
      sourceArr.forEach(function (data) {
        if (data.match(conf.sourcePatten)) {
          targetArr[RegExp.$1] = targetArr[RegExp.$1] || [];
          targetArr[RegExp.$1][RegExp.$2] = [RegExp.$3, RegExp.$5];
        }
      });
      conf.dataSource = sourceArr;
      conf.dataTarget = targetArr;
    },

    genBestData: function () {
      var filename = conf.dataTargetPath + conf.dataBestFile,
        fileContent = [];
      conf.dataTarget.forEach(function (dataRow, i) {
        var rowContent = [];
        dataRow.forEach(function (data) {
          rowContent.push((+data[0]).toString(16));
        });
        fileContent.push(rowContent.join(''));
      });
      builder.saveFileContent(filename, fileContent.join('\n'));
      console.log(filename, 'was generated.');
    },

    genSolutionsData: function () {
      var filename, fileContent = [];
      conf.dataTarget.forEach(function (dataRow, i) {
        dataRow.forEach(function (data, j) {
          fileContent.push(i + '#' + j + ' ' + data[1]);
        });
        if (!(i % 50) || i === conf.dataTarget.length) {
          filename = conf.dataTargetPath + conf.dataSolutionFile.replace(/%n/, (i-1)/50|0);
          builder.saveFileContent(filename, fileContent.join('\n'));
          console.log(filename, 'was generated.');
          fileContent = [];
        }
      });
    },

    build: function () {
      builder.getSourceData();
      builder.genBestData();
      builder.genSolutionsData();
    }

  };

builder.build();
