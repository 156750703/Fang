var C = require('./const');
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