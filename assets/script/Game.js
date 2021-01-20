
cc.Class({
    extends: cc.Component,

    properties: {

        starPrefab:{
            default:null,
            type: cc.Prefab
        },

       maxStarDuration: 10,
       minStarDuration: 8,

       ground: {
           default: null,
           type: cc.Node
       },

       player: {
            default: null,
            type: cc.Node
       },

       scoreDisplay: {
            default: null,
            type: cc.Label
       },
    
    },

    onLoad () {
        // 获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;

        this.timer = 0;
        this.starDuration = 0;

        // 生成一个新的星星
        this.spawnNewStar();
        this.score = 0;
    },

    start () {

    },

    spawnNewStar: function() {
        // 使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab);

        // 在星星脚本组件上保存 Game 对象的引用
        newStar.getComponent('Star').game = this;
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());

        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
            var randX = 0;
            // 根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
            var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
            // 根据屏幕宽度，随机得到一个星星 x 坐标
            var maxX = this.node.width/2;
            randX = (Math.random() - 0.5) * 2 * maxX;
            // 返回星星坐标
            return cc.v2(randX, randY);
        },

    update: function (dt) {
        if(this.timer > this.starDuration) {
            //每帧更新计时器，超过限度还没有生成新的星星，就会调用游戏失败逻辑
            this.gameOver();
            return ;
        }
        this.timer += dt;
    },

    gainScore: function() {
        this.score += 1;
        //  更新scoreDisplay label的文字？？？？
        this.scoreDisplay.string = 'Score: ' + this.score;
    },

    gameOver: function() {
        this.player.stopAllActions();

        cc.director.loadScene('game');
    },


});
