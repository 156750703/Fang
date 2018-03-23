var C = require('./const');
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