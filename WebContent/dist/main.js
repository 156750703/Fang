/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/const.js":
/*!**********************!*\
  !*** ./src/const.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
    TOPLEFT_X: 50,
    TOPLEFT_Y: 50,
    GRID_LENGTH: 100,
    PIECE_RADIUS: 20,    

    BLACK: 1,
    WHITE: 2,

    STAGE_READY: 0,
    STAGE_OCCUPY: 1,
    STAGE_CAPTURE: 2,
    STAGE_MOVE: 3,
    STAGE_FINISH: 4,

    OPENING:0,
    OCCUPY:1,    
    CAPTURE:2,   
    MOVE_SOURCE:3,
    MOVE_TARGET:4,
    MOVE_CAPTURE:5,
    
    COLOR_PINK:'#FF6666',
    COLOR_RED:'#FF0000',
    COLOR_GREEN:'#66CC99'
};

/***/ }),

/***/ "./src/control.js":
/*!************************!*\
  !*** ./src/control.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var C = __webpack_require__(/*! ./const */ "./src/const.js");
var render = __webpack_require__(/*! ./render */ "./src/render.js");
var formation = __webpack_require__(/*! ./formation */ "./src/formation.js");
var display = __webpack_require__(/*! ./display */ "./src/display.js");
var async = __webpack_require__(/*! async */ "async");

var status = {
    stage: C.STAGE_READY,
    wait: C.OPENING,
    availibleStep: 0,
    currentColor: 0,
    captureLeft: 2,
    lastPosition: false,
    historyFormation: [[], []],
    watchMode: false,
    winner: 0
};

var board = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0
];





var control = {
    handler: function (x, y) {
        if (status.watchMode) {
            return;
        }
        if (status.stage == C.STAGE_READY || status.statge == C.STAGE_FINISH) {
            return;
        }
        if (status.availibleStep == 0) {
            throw "availible step remains 0.chess eroor!";
        }
        if (status.stage === C.STAGE_OCCUPY) {
            this.occupyHandler(x, y);
        } else if (status.stage === C.STAGE_CAPTURE) {
            this.captureHandler(x, y);
        } else if (status.stage === C.STAGE_MOVE) {
            this.moveHandler(x, y);
        }
    },
    occupyHandler: function (x, y) {
        var position = x + y * 5;
        if (board[position]) {
            return;
        }

        render.drawPiece(status.currentColor, x, y);
        render.clearCircle();
        render.drawCircle(C.COLOR_PINK, x, y);
        board[x + y * 5] = status.currentColor;
        status.availibleStep--;

        var resultFormation = matchFormation(status.currentColor, x, y);
        if (resultFormation.length > 0) {
            display.displayFormations(status, resultFormation);
            blinkFlow(resultFormation, handleLater);
        } else {
            handleLater();
        }


        function handleLater() {
            if (isBoardFull()) {
                status.stage = C.STAGE_CAPTURE;
                status.wait = C.CAPTURE;
                status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                status.availibleStep = 1;
                display.displayStatus(status);
            } else {

                if (status.availibleStep == 0) {
                    status.stage = C.STAGE_OCCUPY;
                    status.wait = C.OCCUPY;
                    status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                    status.availibleStep = 1;
                }

                if (resultFormation.length == 0) {
                    display.displayStatus(status);
                }
            }
        }
    },
    captureHandler: function (x, y) {
        var position = x + y * 5;
        if (board[position] == 0 || board[position] == status.currentColor) {
            return;
        }
        render.capturePiece(x, y);
        render.clearCircle();
        render.drawCircle(C.COLOR_PINK, x, y);
        board[position] = 0;
        status.captureLeft--;
        if (status.captureLeft == 1) {
            status.stage = C.STAGE_CAPTURE;
            status.wait = C.CAPTURE;
            status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
            status.availibleStep = 1;
        } else {
            status.stage = C.STAGE_MOVE;
            status.wait = C.MOVE_SOURCE;
            status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
            status.availibleStep = 1;
        }
        display.displayStatus(status);
    },
    moveHandler: function (x, y) {
        var position = x + y * 5;

        if (status.wait == C.MOVE_SOURCE) {
            if (board[position] != status.currentColor) {
                return;
            }
            status.lastPosition = [x, y];

            render.clearCircle();
            render.drawCircle(C.COLOR_PINK, x, y);

            status.wait = C.MOVE_TARGET;
        }
        if (status.wait == C.MOVE_TARGET) {
            if (board[position] != 0) {
                return;
            }
            var lastPos = status.lastPosition[0] + 5 * status.lastPosition[1];
            var gap = Math.abs(position - lastPos);
            if (gap != 1 && gap != 5) {
                return;
            }
            render.capturePiece(status.lastPosition[0], status.lastPosition[1]);
            render.drawPiece(status.currentColor, x, y);
            render.clearCircle();
            render.drawCircle(C.COLOR_GREEN, status.lastPosition[0], status.lastPosition[1]);
            render.drawCircle(C.COLOR_PINK, x, y);
            status.availibleStep--;
            status.lastPosition = [x, y];
            board[lastPos] = 0;
            board[position] = status.currentColor;

            var resultFormation = matchFormation(status.currentColor, x, y);

            var hisArr = status.historyFormation[status.currentColor];
            var hisObj = {
                location: [x, y],
                formation: resultFormation
            };

            if (resultFormation.length > 0) {
                if (hisArr.length >= 2 && isSameHistory(hisObj, hisArr[1])) {
                    display.displayInfo('不能重复在同一位置成同一种型');
                } else {
                    hisArr.unshift(hisObj = {
                        location: [x, y],
                        formation: resultFormation
                    });
                }
            }

            if (status.availibleStep == 0) {
                status.stage = C.STAGE_MOVE;
                status.wait = C.MOVE_SOURCE;
                status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                status.availibleStep = 1;
                display.displayStatus(status);
            } else {
                status.stage = C.STAGE_MOVE;
                status.wait = C.MOVE_CAPTURE;
                display.displayFormations(status, resultFormation);
                blinkFlow(resultFormation, function(){});
            }
        }

        if (status.wait == C.MOVE_CAPTURE) {
            var oppsiteColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
            if (board[position] != oppsiteColor) {
                return;
            }
            status.availibleStep--;
            render.capturePiece(x, y);
            render.clearCircle();
            render.drawCircle(C.COLOR_PINK, x, y);
            board[position] = 0;
            if (getWinner() != 0) {
                document.getElementById('btnTerminate').style.display = 'none';
                document.getElementById('btnStart').style.display = '';
                status.winner = getWinner();
                status.stage = C.STAGE_FINISH;
                status.wait = C.OPENING;
                status.availibleStep = 0;
                status.captureLeft = 2;
                board = [
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0
                ];

            } else if (status.availibleStep == 0) {
                status.stage = C.STAGE_MOVE;
                status.wait = C.MOVE_SOURCE;
                status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                status.availibleStep = 1;
            }
            display.displayStatus(status);
        }
    }
};

function isSameHistory(h1, h2) {
    if (!isArrayEqual(h1.location, h2.location)) {
        return;
    }
    var f1 = flatten(h1.formation);
    var f2 = flatten(h2.formation);
    var sum = 0;
    for (var i = 0; i < f1.length; i++) {
        for (var j = 0; j < f2.length; j++) {
            if (isArrayEqual(f1[i], f2[j])) {
                sum++;
            }
        }
    }
    if (sum > 0) {
        return true;
    }
}

function flatten(arr) {
    var nArr = [], i = 0;
    do {
        nArr = nArr.concat(arr[i]);
    } while (++i < arr.length)
    return nArr;
}

function isArrayEqual(arr1, arr2) {
    if (arr1.length != arr2.length) {
        return;
    }
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] != arr2[i]) {
            break;
        }
    }
    if (i == arr1.length) {
        return true;
    }
}

function matchFormation(color, x, y, endCallback) {
    var position = x + y * 5;
    var resultFormation = [];

    var resultTong = formation.matchTong(board, color, position);
    if (resultTong.length) {
        status.availibleStep += resultTong.length * 3;
        resultFormation.push(resultTong);
    }
    var resultXie4 = formation.matchXie4(board, color, position);
    if (resultXie4.length) {
        status.availibleStep += resultXie4.length * 2;
        resultFormation.push(resultXie4);
    }
    var resultXie = formation.matchXie(board, color, position);
    if (resultXie.length) {
        status.availibleStep += resultXie.length * 1;
        resultFormation.push(resultXie);
    }
    var resultFang = formation.matchFang(board, color, position);
    if (resultFang.length) {
        status.availibleStep += resultFang.length * 1;
        resultFormation.push(resultFang);
    }
    var resultPilin = formation.matchPilin(board, color, position);
    if (resultPilin.length) {
        status.availibleStep += resultPilin.length * 2;
        resultFormation.push(resultPilin);
    }
    return resultFormation;
}

function blinkFlow(formations, endCallback) {
    status.watchMode = true;
    formations = flatten(formations);
    var tasks = formations.map(function (f) {
        return function (callback) {
            blink(f, callback)
        }
    });
    async.waterfall(tasks, function (err, result) {
        status.watchMode = false;
        endCallback();
    })
}

function blink(formation, callback) {
    var i = 0;
    var handler = setInterval(function () {
        if (i % 2 == 0) {
            hlFormation(formation);
        } else {
            render.rmHighlight();
        }
        if (i == 3) {
            clearInterval(handler);
            callback()
        }
        i++;
    }, 300)
}

function hlFormation(formation) {
    var position = formation.position;
    if (['tong', 'xie4', 'xie', 'pilin'].indexOf(formation.type) > -1) {

        for (var i = 0; i < position.length - 1; i++) {
            var x1 = position[i] % 5;
            var y1 = Math.floor(position[i] / 5);
            var x2 = position[i + 1] % 5;
            var y2 = Math.floor(position[i + 1] / 5);
            render.highlight([x1, y1], [x2, y2]);
        }
    } else if (formation.type == 'fang') {
        for (var i = 0; i < position.length; i++) {
            if (i < position.length - 1) {
                var x1 = position[i] % 5;
                var y1 = Math.floor(position[i] / 5);
                var x2 = position[i + 1] % 5;
                var y2 = Math.floor(position[i + 1] / 5);
                render.highlight([x1, y1], [x2, y2]);
            } else {
                var x1 = position[i] % 5;
                var y1 = Math.floor(position[i] / 5);
                var x2 = position[0] % 5;
                var y2 = Math.floor(position[0] / 5);
                render.highlight([x1, y1], [x2, y2]);
            }
        }
    }
}


document.getElementById('btnStart').addEventListener('click', function () {
    this.style.display = 'none';
    document.getElementById('btnTerminate').style.display = '';
    status.stage = C.STAGE_OCCUPY;
    status.wait = C.OCCUPY;
    status.currentColor = C.BLACK;
    status.availibleStep = 1;
    render.clearBoard();
    render.clearCircle();
    display.displayStatus(status);
});

document.getElementById('btnTerminate').addEventListener('click', function () {
    this.style.display = 'none';
    document.getElementById('btnStart').style.display = '';
    status.stage = C.STAGE_FINISH;
    status.wait = C.OPENING;
    status.availibleStep = 0;
    status.captureLeft = 2;
    board = [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
    ];
    display.displayStatus(status);
});


display.displayStatus(status);

render.bind('click.control', function (evt) {
    //console.log(evt.GridX, evt.GridY);
    var x = evt.GridX;
    var y = evt.GridY;
    control.handler(x, y);
});


function isBoardFull() {
    return board.indexOf(0) < 0;
}

function getWinner() {
    if (board.indexOf(C.BLACK) < 0) {
        return C.WHITE;
    }
    if (board.indexOf(C.WHITE) < 0) {
        return C.BLACK;
    }
    return 0;
}

module.exports = control;


/***/ }),

/***/ "./src/display.js":
/*!************************!*\
  !*** ./src/display.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var C = __webpack_require__(/*! ./const */ "./src/const.js");
var infoArea = document.getElementById('infoArea');

function getStatusInfo(status) {
    var info = '', color = '';
    if (status.currentColor == C.BLACK) {
        color = '黑方';
    } else if (status.currentColor == C.WHITE) {
        color = '白方';
    }

    if (status.stage == C.STAGE_READY) {
        info += '请开局';
    }
    if (status.stage == C.STAGE_OCCUPY) {
        info += '落子阶段：' + color + '落子，剩余' + status.availibleStep + '步可落';
    }
    if (status.stage == C.STAGE_CAPTURE) {
        info += '吃子阶段：' + color + '吃子，剩余' + status.availibleStep + '子可吃';
    }
    if (status.stage == C.STAGE_MOVE) {
        if ([C.MOVE_SOURCE, C.MOVE_TARGET].indexOf(status.wait) > -1) {
            info += '走子阶段：' + color + '走子，剩余1步可走';
        }
        if (status.wait == C.MOVE_CAPTURE) {
            info += '走子阶段：' + color + '吃子，剩余' + status.availibleStep + '子可吃';
        }
    }
    if (status.stage == C.STAGE_FINISH) {       
        if (status.winner == C.BLACK) {
            winColor = '黑方';
        } else if(status.winner == C.WHITE){
            winColor = '白方';
        }
        if (winColor) {
            info += '已结束。赢者：' + winColor;
        }
    }
    return info;
}

function getFormationInfo(results) {
    var info = '';
    var color = '';
    if (results[0].color == C.BLACK) {
        color = '黑方';
    } else if (results[0].color == C.WHITE) {
        color = '白方';
    }

    if (results[0].type == 'tong') {
        info += color + '成' + results.length + '个五通棋型，加' + results.length * 3 + '步';
    }
    if (results[0].type == 'xie4') {
        info += color + '成' + results.length + '个四斜棋型，加' + results.length * 2 + '步';
    }
    if (results[0].type == 'xie') {
        info += color + '成' + results.length + '个斜棋型，加' + results.length * 1 + '步';
    }
    if (results[0].type == 'fang') {
        info += color + '成' + results.length + '个方棋型，加' + results.length * 1 + '步';
    }
    if (results[0].type == 'pilin') {
        info += color + '成' + results.length + '个匹林棋型，加' + results.length * 2 + '步';
    }
    return info;
}

function displayStatus(status) {
    infoArea.innerHTML = getStatusInfo(status);
}

function displayFormations(status, formations) {
    var info = formations.map(function (f) {
        return getFormationInfo(f);
    }).join('<br>');
    infoArea.innerHTML = info + '<br>' + getStatusInfo(status);
}

function displayInfo(info) {
    infoArea.innerHTML = info + '<br>' + getStatusInfo(status);
}

module.exports = {
    displayInfo: displayInfo,
    displayStatus: displayStatus,
    displayFormations: displayFormations
}

/***/ }),

/***/ "./src/formation.js":
/*!**************************!*\
  !*** ./src/formation.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {


var board = [
    0/*00*/, 0/*01*/, 0/*02*/, 0/*03*/, 0/*04*/,

    0/*05*/, 0/*06*/, 0/*07*/, 0/*08*/, 0/*09*/,

    0/*10*/, 0/*11*/, 0/*12*/, 0/*13*/, 0/*14*/,

    0/*15*/, 0/*16*/, 0/*17*/, 0/*18*/, 0/*19*/,

    0/*20*/, 0/*21*/, 0/*22*/, 0/*23*/, 0/*24*/
];

var formation = {
    tong: [[0, 6, 12, 18, 24], [4, 8, 12, 16, 20]],
    xie4: [[3, 7, 11, 15], [1, 7, 13, 19], [5, 11, 17, 23], [9, 13, 17, 21]],
    xie: [[2, 6, 10], [2, 8, 14], [10, 16, 22], [14, 18, 22]],
    fang: [
        [0, 1, 6, 5], [1, 2, 7, 6], [2, 3, 8, 7], [3, 4, 9, 8],
        [5, 6, 11, 10], [6, 7, 12, 11], [7, 8, 13, 12], [8, 9, 14, 13],
        [10, 11, 16, 15], [11, 12, 17, 16], [12, 13, 18, 17], [13, 14, 19, 18],
        [15, 16, 21, 20], [16, 17, 22, 21], [17, 18, 23, 22], [18, 19, 24, 23]
    ],
    pilin: [
        [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24]
    ],
    matchTong: matchTong,
    matchXie4: matchXie4,
    matchXie: matchXie,
    matchFang: matchFang,
    matchPilin: matchPilin
}


function matchTong(combatBoard, color, position) {
    var result = [];
    for (var i = 0; i < 2; i++) {
        var formation_tong = formation.tong[i];
        if (formation_tong.indexOf(position) > -1) {
            for (var j = 0; j < 5; j++) {
                if (combatBoard[formation_tong[j]] != color) {
                    break;
                }
            }
            if (j == 5) {
                result.push({
                    type: 'tong',
                    color: color,
                    position: formation_tong.slice(0)
                })
            }
        }
    }

    return result;
}

function matchXie4(combatBoard, color, position) {
    var result = [];
    for (var i = 0; i < 4; i++) {
        var formation_xie4 = formation.xie4[i];
        if (formation_xie4.indexOf(position) > -1) {
            for (var j = 0; j < 4; j++) {
                if (combatBoard[formation_xie4[j]] != color) {
                    break;
                }
            }
            if (j == 4) {
                result.push({
                    type: 'xie4',
                    color: color,
                    position: formation_xie4.slice(0)
                })
            }
        }
    }

    return result;
}

function matchXie(combatBoard, color, position) {
    var result = [];
    for (var i = 0; i < 4; i++) {
        var formation_xie = formation.xie[i];
        if (formation_xie.indexOf(position) > -1) {
            for (var j = 0; j < 3; j++) {
                if (combatBoard[formation_xie[j]] != color) {
                    break;
                }
            }
            if (j == 3) {
                result.push({
                    type: 'xie',
                    color: color,
                    position: formation_xie.slice(0)
                })
            }
        }
    }
    return result;
}

function matchFang(combatBoard, color, position) {
    var result = [];
    for (var i = 0; i < 16; i++) {
        var formation_fang = formation.fang[i];
        if (formation_fang.indexOf(position) > -1) {
            for (var j = 0; j < 4; j++) {
                if (combatBoard[formation_fang[j]] != color) {
                    break;
                }
            }
            if (j == 4) {
                result.push({
                    type: 'fang',
                    color: color,
                    position: formation_fang.slice(0)
                })
            }
        }
    }
    return result;
}

function matchPilin(combatBoard, color, position) {
    var result = [];
    for (var i = 0; i < 10; i++) {
        var formation_pilin = formation.pilin[i];
        if (formation_pilin.indexOf(position) > -1) {
            for (var j = 0; j < 5; j++) {
                if (combatBoard[formation_pilin[j]] != color) {
                    break;
                }
            }
            if (j == 5) {
                result.push({
                    type: 'pilin',
                    color: color,
                    position: formation_pilin.slice(0)
                })
            }
        }
    }
    return result;
}

module.exports = formation;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var  render = __webpack_require__(/*! ./render */ "./src/render.js");
var control = __webpack_require__(/*! ./control */ "./src/control.js");

render.drawBoard();


/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var C = __webpack_require__(/*! ./const */ "./src/const.js");
var boardCanvas = document.getElementById("board");
var boardCtx = boardCanvas.getContext('2d');
var selectedCanvas = document.getElementById("selected");
var selectedCtx = selectedCanvas.getContext('2d');
var highlightCanvas = document.getElementById("highlight");
var highlightCtx = highlightCanvas.getContext('2d');

var render = {
    drawBoard: function drawBoard() {
        var rightBottom = {
            X: C.TOPLEFT_X + C.GRID_LENGTH * 4,
            Y: C.TOPLEFT_Y + C.GRID_LENGTH * 4,
        };

        boardCtx.beginPath();
        for (var i = 0; i < 5; i++) {
            boardCtx.moveTo(C.TOPLEFT_X, C.TOPLEFT_Y + i * C.GRID_LENGTH);
            boardCtx.lineTo(rightBottom.X, C.TOPLEFT_Y + i * C.GRID_LENGTH);

            boardCtx.moveTo(C.TOPLEFT_X + i * C.GRID_LENGTH, C.TOPLEFT_Y);
            boardCtx.lineTo(C.TOPLEFT_X + i * C.GRID_LENGTH, rightBottom.Y);
        }
        boardCtx.closePath();
        boardCtx.lineWidth = 1;
        boardCtx.stroke();
    },
    drawPiece: function drawPiece(type, m, n) {
        var targetX = C.TOPLEFT_X + m * C.GRID_LENGTH;
        var targetY = C.TOPLEFT_Y + n * C.GRID_LENGTH;

        boardCtx.clearRect(targetX - C.PIECE_RADIUS, targetY - C.PIECE_RADIUS, 2 * C.PIECE_RADIUS, 2 * C.PIECE_RADIUS);
        boardCtx.beginPath();
        boardCtx.arc(targetX, targetY, C.PIECE_RADIUS, 0, Math.PI * 2);
        boardCtx.closePath();
        if (type == C.WHITE) {
            boardCtx.stroke();
        } else {
            boardCtx.fill();
        }
    },
    drawCircle: function (color, m, n) {
        var targetX = C.TOPLEFT_X + m * C.GRID_LENGTH;
        var targetY = C.TOPLEFT_Y + n * C.GRID_LENGTH;
        selectedCtx.beginPath();
        selectedCtx.arc(targetX, targetY, C.PIECE_RADIUS + 5, 0, Math.PI * 2);
        selectedCtx.closePath();

        selectedCtx.strokeStyle = color;
        selectedCtx.lineWidth = 2;
        selectedCtx.stroke();
    },
    clearCircle: function () {
        selectedCtx.clearRect(0, 0, 500, 500);
    },
    clearBoard: function () {
        boardCtx.clearRect(0, 0, 500, 500);
        this.drawBoard();
    },
    capturePiece: function (m, n) {
        var targetX = C.TOPLEFT_X + m * C.GRID_LENGTH;
        var targetY = C.TOPLEFT_Y + n * C.GRID_LENGTH;
        var clearLength = C.GRID_LENGTH / 2;

        boardCtx.clearRect(targetX - clearLength, targetY - clearLength, 2 * clearLength, 2 * clearLength);
        boardCtx.beginPath();


        if (m != 0) {
            boardCtx.moveTo(targetX - clearLength, targetY)
            boardCtx.lineTo(targetX, targetY);
        }
        if (m != 4) {
            boardCtx.moveTo(targetX + clearLength, targetY)
            boardCtx.lineTo(targetX, targetY);
        }
        if (n != 0) {
            boardCtx.moveTo(targetX, targetY - clearLength)
            boardCtx.lineTo(targetX, targetY);
        }
        if (n != 4) {
            boardCtx.moveTo(targetX, targetY + clearLength)
            boardCtx.lineTo(targetX, targetY);
        }

        boardCtx.moveTo(0, 0);
        boardCtx.lineTo(0, 0);

        boardCtx.closePath();
        boardCtx.lineWidth = 1;
        boardCtx.stroke();
    },
    highlight: function (p1, p2) {
        var temp = reArrenge(p1, p2);
        p1 = temp.p1, p2 = temp.p2;
        var x1 = p1[0], y1 = p1[1], x2 = p2[0], y2 = p2[1];
        var srcX, srcY, targetX, targetY;
        highlightCtx.beginPath();
        if (x1 != x2 && y1 == y2) {
            srcX = C.TOPLEFT_X + x1 * C.GRID_LENGTH + C.PIECE_RADIUS;
            srcY = C.TOPLEFT_Y + y1 * C.GRID_LENGTH;
            targetX = C.TOPLEFT_X + x2 * C.GRID_LENGTH - C.PIECE_RADIUS;
            targetY = C.TOPLEFT_Y + y2 * C.GRID_LENGTH;
            highlightCtx.moveTo(srcX, srcY);
            highlightCtx.lineTo(targetX, targetY);
        }
        if (x1 == x2 && y1 != y2) {
            srcX = C.TOPLEFT_X + x1 * C.GRID_LENGTH;
            srcY = C.TOPLEFT_Y + y1 * C.GRID_LENGTH + C.PIECE_RADIUS;
            targetX = C.TOPLEFT_X + x2 * C.GRID_LENGTH;
            targetY = C.TOPLEFT_Y + y2 * C.GRID_LENGTH - C.PIECE_RADIUS;
            highlightCtx.moveTo(srcX, srcY);
            highlightCtx.lineTo(targetX, targetY);
        }
        if (x1 != x2 && y1 != y2) {
            if (x1 < x2) {
                srcX = C.TOPLEFT_X + x1 * C.GRID_LENGTH + C.PIECE_RADIUS * Math.SQRT1_2;
                srcY = C.TOPLEFT_Y + y1 * C.GRID_LENGTH + C.PIECE_RADIUS * Math.SQRT1_2;
                targetX = C.TOPLEFT_X + x2 * C.GRID_LENGTH - C.PIECE_RADIUS * Math.SQRT1_2;
                targetY = C.TOPLEFT_Y + y2 * C.GRID_LENGTH - C.PIECE_RADIUS * Math.SQRT1_2;
            }else if( x1 > x2){
                srcX = C.TOPLEFT_X + x1 * C.GRID_LENGTH - C.PIECE_RADIUS * Math.SQRT1_2;
                srcY = C.TOPLEFT_Y + y1 * C.GRID_LENGTH + C.PIECE_RADIUS * Math.SQRT1_2;
                targetX = C.TOPLEFT_X + x2 * C.GRID_LENGTH + C.PIECE_RADIUS * Math.SQRT1_2;
                targetY = C.TOPLEFT_Y + y2 * C.GRID_LENGTH - C.PIECE_RADIUS * Math.SQRT1_2;
            }

            highlightCtx.moveTo(srcX, srcY);
            highlightCtx.lineTo(targetX, targetY);
        }
        highlightCtx.closePath();
        highlightCtx.strokeStyle = C.COLOR_RED;
        highlightCtx.lineWidth = 4;
        highlightCtx.stroke();
    },
    rmHighlight: function () {
        highlightCtx.clearRect(0, 0, 500, 500);
    },
    evtList: {},
    bind: function (id, func) {
        this.evtList[id] = func;
    }
};

function reArrenge(p1, p2) {
    var pos1 = p1[0] + 5 * p1[1];
    var pos2 = p2[0] + 5 * p2[1];
    if (pos1 < pos2) {
        return { p1: p1, p2: p2 };
    } else {
        return { p1: p2, p2: p1 };
    }
}

boardCanvas.addEventListener('click', function (evt) {
    //console.log(evt);    
    var offsetX = evt.offsetX;
    var offsetY = evt.offsetY;

    var validX = Math.abs(offsetX % C.GRID_LENGTH - C.TOPLEFT_X) <= C.PIECE_RADIUS;
    var validY = Math.abs(offsetY % C.GRID_LENGTH - C.TOPLEFT_Y) <= C.PIECE_RADIUS;
    if (validX && validY) {
        var m = Math.floor(offsetX / C.GRID_LENGTH);
        var n = Math.floor(offsetY / C.GRID_LENGTH);
        evt.GridX = m;
        evt.GridY = n;
        //console.log(m, n);
        for (var funId in render.evtList) {
            render.evtList[funId](evt);
        }
    }
});

module.exports = render;

/***/ }),

/***/ "async":
/*!************************!*\
  !*** external "async" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = async;

/***/ })

/******/ });
//# sourceMappingURL=main.js.map