(function (undefined) {
  'use strict';
  var tchisla = window.tchisla = {
    dataFile: 'solutions.txt',
    eventPool: {},
    subscribe: function (eventName, callback) {
      tchisla.eventPool[eventName] = tchisla.eventPool[eventName] || [];
      tchisla.eventPool[eventName].push(callback);
    },
    publish: function (eventName, parameters) {
      return !tchisla.eventPool[eventName] ||
        tchisla.eventPool[eventName].forEach(function (callback) {
          callback(parameters);
        });
    },
    getData: function () {
      var request = new XMLHttpRequest();
      request.open('GET', tchisla.dataFile, true);
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          var data = request.responseText;
          tchisla.dataArr = data.split(/[\n\r]+/);
          tchisla.publish('dataReady', tchisla.dataArr);
        }
      };
      request.send();
    },
    parseData: function (dataArr) {
      dataArr.forEach(function (data) {
        if (data.match(/^((\d+)#(\d+))\[(\d+)\] ([√^!+\-*/\d\(\)]+)$/)) {
          var quiz = RegExp.$1, targetNum = RegExp.$2, baseNum = RegExp.$3,
            bestScore = RegExp.$4, answer = RegExp.$5;
        }
      });
      tchisla.publish('dataParsed', tchisla.dataArr);
    },
    preparePad: function () {
      tchisla.$solutionPas = document.getElementById('solutions');
    },
    initial: function () {

      //tchisla.subscribe('dataReady', tchisla.parseData);
      tchisla.getData();
    }
  };

  tchisla.initial();

})();
