(function (undefined) {
  'use strict';
  var sys = {
      dataPath: 'data/',
      dataBest: 'best.dat',
      dataSolutions: 'solution.%n.dat',
      $solutionPas: document.getElementById('solutions')
    },
    tchisla = window.tchisla = {
      getData: function (file, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', file, true);
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            console.log('file load success', file);
            callback(request.responseText);
          }
        };
        request.send();
      },

      parseData: function (dataSolution) {
        var solutionArr = dataSolution.split(/[\n\r]+/);
        solutionArr.forEach(function (data) {
          if (data.match(/^((\d+)#(\d+)) ([√^!+\-*/\d\(\)]+)$/)) {
            var quiz = RegExp.$1, targetNum = RegExp.$2, baseNum = RegExp.$3, answer = RegExp.$4;
          }
        });
        sys.publish('dataParsed', tchisla.dataArr);
      },

      preparePad: function (dataBest) {
        var bestArr = dataBest.split(/[\n\r]+/);
        bestArr.forEach(function (line, y) {
          var tr = document.createElement('tr'),
            td = document.createElement('td');
          td.setAttribute('class', 'row');
          td.innerText = y + 1;
          tr.appendChild(td);
          for (var x = 0; x <= 8; x++) {
            td = document.createElement('td');
            td.setAttribute('rel', y + '#' + x);
            td.innerText = Number('0x' + line[x]);
            tr.appendChild(td);
          }
          sys.$solutionPas.appendChild(tr);
        });
      },
      initial: function () {
        tchisla.getData(sys.dataPath + sys.dataBest, tchisla.preparePad);
      }
    };

  tchisla.initial();

})();
