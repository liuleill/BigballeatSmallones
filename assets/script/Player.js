
cc.Class({
    extends: cc.Component,

    properties: {
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        accel: 0,

        touchControl: {
            default: null,
            type: cc.Node
        }
    },

    

    onLoad: function(){
        var jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start();

        this.accLeft = false;//还没激活向左边的加速度
        this.accRight = false;

        this.xSpeed = 0;  //水平速度为0

        //初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);  



        // //监听触摸开始事件
    	// this.node.on(cc.Node.EventType.TOUCH_START,function(t){
    	// 	//函数体内写事件发生时的事情
    	// 	//当触摸开始是打印以下字样
        //     console.log("触摸开始");
        //     on_touch_move(t);
    	// },this);
    	// //监听触摸移动事件
    	// //使用自定义回调函数
    	// this.node.on(cc.Node.EventType.TOUCH_MOVE,this.on_touch_move,this);
    	// //结束触摸移动事件
    	// //this.node.off(cc.Node.EventType.TOUCH_MOVE,this.on_touch_move,this);
    	
    	// //监听作用域内触摸抬起事件
    	// this.node.on(cc.Node.EventType.TOUCH_ENDED,function(t){
    	// 	console.log("触摸内结束");
    	// },this);
    	// //监听作用域外触摸抬起事件
    	// this.node.on(cc.Node.EventType.TOUCH_CANCEL,function(t){
        //     console.log("触摸外开始");
            
        // },this);
        
        this.addTouchEvent(this.touchControl);
    },

    addTouchEvent: function(node) {
        node.on(cc.Node.EventType.TOUCH_START,(event)=>{
            let viewSize = cc.view.getVisibleSize();
            //event.touch._point.x > viewSize.width/2 ?  this.accLeft = true : this.accRight = true;
            event.touch._point.x < viewSize.width/2 ?  this.accLeft = true : this.accRight = true;
            
        });
        node.on(cc.Node.EventType.TOUCH_END,()=>{
            this.accLeft = false;
            this.accRight = false;
        });
    },

    // //自定义回调函数,参数t
    // on_touch_move(t){
    // 	//定义一个n_pos变量存储当前触摸点的位置
    // 	var n_pos = t.getLocation();
    // 	//打印触摸点的坐标，x坐标，y坐标
    // 	console.log(n_pos,n_pos.x,n_pos.y);
    // 	//定义变量delta存储变化距离
    // 	var delta = t.getDelta();
    // 	//变化当前节点位置使其跟随触摸点,实现按住移动效果
    // 	this.node.x += delta.x;
    // 	this.node.y += delta.y;
    // },

    onDestoryKey () {
        //取消键盘监听事件
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    runJumpAction () {
        var jumpUp = cc.tween().by(this.jumpDuration, {y: this.jumpHeight}, {easing: 'sineOut'});
        // 下落
        var jumpDown = cc.tween().by(this.jumpDuration, {y: -this.jumpHeight}, {easing: 'sineIn'});

        // 创建一个缓动，按 jumpUp、jumpDown 的顺序执行动作
        var tween = cc.tween().sequence(jumpUp, jumpDown);
        // 不断重复
        return cc.tween().repeatForever(tween);
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left : 
                this.accLeft = true;
                break;
            case cc.macro.KEY.right:
                this.accRight = true;
                break;

            case cc.macro.KEY.a : 
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },   
    
    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.right:
                this.accRight = false;
                break;

            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },

    start () {

    },

    update: function(dt) {
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        }
        else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        this.node.x += this.xSpeed * dt;
    }
});
