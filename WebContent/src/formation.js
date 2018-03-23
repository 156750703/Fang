
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