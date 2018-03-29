var C = require('./const');
var render = require('./render');
var formation = require('./formation');
var display = require('./display');
var async = require('async');

var status = {
    stage: C.STAGE_READY,
    wait: C.OPENING,
    availibleStep: 0,
    currentColor: 0,
    captureLeft: 2,
    lastPosition: false,
    historyFormation: [[], [], []],
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
            display.displayStatus(status);
        } else {
            var oppsiteColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
            if (canMoveStep(oppsiteColor) == 0) {
                status.winner = status.currentColor;
                buildfinishState();
                display.dispalyCannotMove(status);
            } else {
                status.stage = C.STAGE_MOVE;
                status.wait = C.MOVE_SOURCE;
                status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                status.availibleStep = 1;
                display.displayStatus(status);
            }
        }
       
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
        } else if (status.wait == C.MOVE_TARGET) {
            if (isArrayEqual([x, y], status.lastPosition)) {
                render.clearCircle();
                status.stage = C.STAGE_MOVE;
                status.wait = C.MOVE_SOURCE;
                return;
            }
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
                    display.displayInfo(status, '不能重复在同一位置成同一种型');
                } else {
                    hisArr.unshift(hisObj = {
                        location: [x, y],
                        formation: resultFormation
                    });
                }
            }

            if (status.availibleStep == 0) {
                var oppsiteColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                if (canMoveStep(oppsiteColor) == 0) {
                    status.winner = status.currentColor;
                    buildfinishState();
                    display.dispalyCannotMove(status);
                } else {
                    status.stage = C.STAGE_MOVE;
                    status.wait = C.MOVE_SOURCE;
                    status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                    status.availibleStep = 1;
                    display.displayStatus(status);
                }
            } else {
                status.stage = C.STAGE_MOVE;
                status.wait = C.MOVE_CAPTURE;
                display.displayFormations(status, resultFormation);
                blinkFlow(resultFormation, function () { });
            }
        } else if (status.wait == C.MOVE_CAPTURE) {
            var oppsiteColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
            if (board[position] != oppsiteColor) {
                return;
            }
            status.availibleStep--;
            render.capturePiece(x, y);
            render.clearCircle();
            render.drawCircle(C.COLOR_PINK, x, y);
            board[position] = 0;
            if (getEmptyWinner() != 0) {
                status.winner = getEmptyWinner();
                buildfinishState();
                display.displayStatus(status);
            } else if (status.availibleStep == 0) {
                var oppsiteColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                if (canMoveStep(oppsiteColor) == 0) {
                    status.winner = status.currentColor;
                    buildfinishState();
                    display.dispalyCannotMove(status);
                } else {
                    status.stage = C.STAGE_MOVE;
                    status.wait = C.MOVE_SOURCE;
                    status.currentColor = status.currentColor == C.BLACK ? C.WHITE : C.BLACK;
                    status.availibleStep = 1;
                    display.displayStatus(status);
                }
            }
           
        }
    }
};


function buildfinishState() {
    document.getElementById('btnTerminate').style.display = 'none';
    document.getElementById('btnStart').style.display = '';
    //status.winner = getWinner();
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
}

function canMoveStep(color) {
    var stepCount = 0;
    for (var i = 0; i < board.length; i++) {
        if (board[i] == color) {
            var x = i% 5;
            var y = Math.floor(i / 5);
            if (x != 0 && board[i - 1] == 0) {
                stepCount++;
            }
            if (x != 4 && board[i + 1] == 0) {
                stepCount++;
            }
            if (y != 0 && board[i - 5] == 0) {
                stepCount++;
            }
            if (y != 4 && board[i + 5] == 0) {
                stepCount++;
            }
        }
    }
    return stepCount;
}

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

function getEmptyWinner() {
    if (board.indexOf(C.BLACK) < 0) {
        return C.WHITE;
    }
    if (board.indexOf(C.WHITE) < 0) {
        return C.BLACK;
    }
    return 0;
}

module.exports = control;
