(function () {
  'use strict';
  var sys = {
      dataPath: 'data/',
      dataBest: 'best.dat',
      dataSolutions: 'solution.%n.dat',
      answer: [],
      renderedLines: 0, //current rendered best pad line numbers
      toLines: 0,
      rendering: false,
      $tchislaPad:document.getElementById('tchislaPad'),
      $solutions: document.getElementById('solutions'),
      $answer: document.getElementById('answer'),
      $last: document.getElementById('last'),
      $next: document.getElementById('next'),
      $quiz: document.getElementById('quiz'),
      $formula: document.getElementById('formula'),
      $solution: document.getElementById('solution'),
      getName: function (n) {
        return sys.dataSolutions.replace(/%n/, (n - 1) / 50 | 0)
      },
      getLatex: function (a, s) {
        return '$$' + a + '=' + s.replace(/([a-z])/g, '#$1').replace(/#t/g, '\\times').
          replace(/#s/g, '\\sqrt').replace(/#l/g, '\\left').replace(/#r/g, '\\right').
          replace(/#f/g, '\\frac').replace(/#x/g, '\\textstyle') + '$$';
      }
    },
    tchisla = window.tchisla = {
      getData: function (file, callback, isAsync) {
        var request = new XMLHttpRequest();
        request.open('GET', sys.dataPath + file, isAsync);
        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            console.log('file load success', file);
            sys[file] = request.responseText;
            callback(sys[file]);
          }
        };
        request.send();
      },
      parseData: function (dataSolution) {
        var solutionArr = dataSolution.split(/[\n\r]+/);
        solutionArr.forEach(function (data) {
          if (data.match(/^\d+,\d+,[^,]+,[^,]+$/)) {
            var answerArr = data.split(',');
            sys.answer[answerArr[0]] = sys.answer[answerArr[0]] || [];
            sys.answer[answerArr[0]][answerArr[1]] = [answerArr[2], answerArr[3]];
          }
        });
      },
      onScroll: function () {
        var targetPos = window.scrollY / 41 + 1 + 50 | 0;
        if (sys.renderedLines < targetPos) {
          sys.toLines = targetPos;
          if (!sys.rendering) { tchisla.renderPad(); }
        }
      },
      renderPad: function () {
        sys.rendering = true;
        if (sys.maxY < sys.toLines) {sys.toLines =  sys.maxY;}
        while (sys.renderedLines < sys.toLines) {
          var y = ++sys.renderedLines;
          var tr = document.createElement('tr'), td = document.createElement('td');
          td.setAttribute('class', 'row');
          td.innerText = y;
          tr.appendChild(td);
          for (var x = 1; x <= 9; x++) {
            td = document.createElement('td');
            td.setAttribute('rel', (y) + '#' + (x));
            td.innerText = parseInt(sys.bestArr[y-1][x-1], 36);
            tr.appendChild(td);
          }
          sys.$solutions.appendChild(tr);
        }
        sys.rendering = false;
      },
      showAnswer: function (targetNum, baseNum) {
        sys.x = +baseNum;
        sys.y = +targetNum;
        sys.$answer.style.display = 'block';
        sys.$quiz.innerText = targetNum + '#' + baseNum;
        sys.$solution.innerText = targetNum + '=' + sys.answer[targetNum][baseNum][0];
        if (MathJax) {
          sys.$formula.innerText = sys.getLatex(targetNum, sys.answer[targetNum][baseNum][1]);
          MathJax.Hub.Queue(["Typeset", MathJax.Hub, sys.$formula]);
        }
      },
      render: function () {
        tchisla.getData(sys.dataBest, function (bestData) {
          sys.bestArr = sys[sys.dataBest].split(/[\n\r]+/);
          sys.maxY = sys.bestArr.length;
          sys.$tchislaPad.style.height = sys.bestArr.length * 41 + 6 + 'px';
          sys.toLines = 50;
          if (!sys.rendering) { tchisla.renderPad(); }
        }, true);
        sys.$solutions.addEventListener('click', function (e) {
          var quiz = e.target.getAttribute('rel');
          if (!quiz) { return; }
          var temp = quiz.split('#'), targetNum = +temp[0], baseNum = +temp[1];
          if (!sys[sys.getName(targetNum)]) {
            tchisla.getData(sys.getName(targetNum), tchisla.parseData, false);
          }
          tchisla.showAnswer(targetNum, baseNum);
        });
        sys.$answer.addEventListener('click', function (e) {
          if (e.target.id === 'last') {
            if (--sys.x === 0) { sys.x = 9; sys.y--; }
            if (sys.y <= 0) { sys.x = 1; sys.y = 1; }
            tchisla.showAnswer(sys.y, sys.x);
          } else if (e.target.id === 'next') {
            if (++sys.x === 10) { sys.x = 1; sys.y++; }
            if (sys.y > sys.maxY) { sys.x = 9; sys.y = sys.maxY; }
            tchisla.showAnswer(sys.y, sys.x);
          } else {
            sys.$answer.style.display = 'none';
          }
        });
        document.addEventListener('scroll', tchisla.onScroll);
      }
    };
  tchisla.render();
  window.sys=sys;
})();
