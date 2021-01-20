"use strict";
cc._RF.push(module, '00aceG3ZDRDw4A1ebS0MRQT', 'Star');
// script/Star.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    getPlayerDistance: function getPlayerDistance() {
        // 根据 Player 节点位置判断距离
        var playerPos = this.game.player.getPosition();
        // 根据两点位置计算两点之间距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function onPicked() {
        // 当星星被收集时，调用 Game 脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();

        //调用Game脚本的得分方法
        this.game.gainScore();

        // 然后销毁当前星星节点
        this.node.destroy();
    },
    start: function start() {},


    update: function update(dt) {
        // 每帧判断星星和主角之间的距离是否小于收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }

        //根据Game脚本的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }

});

cc._RF.pop();