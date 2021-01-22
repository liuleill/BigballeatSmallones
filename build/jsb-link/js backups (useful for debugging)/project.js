window.__require = function t(e, i, c) {
function n(a, o) {
if (!i[a]) {
if (!e[a]) {
var r = a.split("/");
r = r[r.length - 1];
if (!e[r]) {
var h = "function" == typeof __require && __require;
if (!o && h) return h(r, !0);
if (s) return s(r, !0);
throw new Error("Cannot find module '" + a + "'");
}
}
var u = i[a] = {
exports: {}
};
e[a][0].call(u.exports, function(t) {
return n(e[a][1][t] || t);
}, u, u.exports, t, e, i, c);
}
return i[a].exports;
}
for (var s = "function" == typeof __require && __require, a = 0; a < c.length; a++) n(c[a]);
return n;
}({
Game: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "65c91plPsFPUqKQum3h2WGd", "Game");
cc.Class({
extends: cc.Component,
properties: {
starPrefab: {
default: null,
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
}
},
onLoad: function() {
this.groundY = this.ground.y + this.ground.height / 2;
this.timer = 0;
this.starDuration = 0;
this.spawnNewStar();
this.score = 0;
},
start: function() {},
spawnNewStar: function() {
var t = cc.instantiate(this.starPrefab);
t.getComponent("Star").game = this;
this.node.addChild(t);
t.setPosition(this.getNewStarPosition());
this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
this.timer = 0;
},
getNewStarPosition: function() {
var t, e = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50, i = this.node.width / 2;
t = 2 * (Math.random() - .5) * i;
return cc.v2(t, e);
},
update: function(t) {
this.timer > this.starDuration ? this.gameOver() : this.timer += t;
},
gainScore: function() {
this.score += 1;
this.scoreDisplay.string = "Score: " + this.score;
},
gameOver: function() {
this.player.stopAllActions();
cc.director.loadScene("game");
}
});
cc._RF.pop();
}, {} ],
Player: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "6140dBXc3lGy6/XECTndfdE", "Player");
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
onLoad: function() {
var t = this.runJumpAction();
cc.tween(this.node).then(t).start();
this.accLeft = !1;
this.accRight = !1;
this.xSpeed = 0;
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
this.addTouchEvent(this.touchControl);
},
addTouchEvent: function(t) {
var e = this;
t.on(cc.Node.EventType.TOUCH_START, function(t) {
var i = cc.view.getVisibleSize();
t.touch._point.x < i.width / 2 ? e.accLeft = !0 : e.accRight = !0;
});
t.on(cc.Node.EventType.TOUCH_END, function() {
e.accLeft = !1;
e.accRight = !1;
});
},
onDestoryKey: function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
},
runJumpAction: function() {
var t = cc.tween().by(this.jumpDuration, {
y: this.jumpHeight
}, {
easing: "sineOut"
}), e = cc.tween().by(this.jumpDuration, {
y: -this.jumpHeight
}, {
easing: "sineIn"
}), i = cc.tween().sequence(t, e);
return cc.tween().repeatForever(i);
},
onKeyDown: function(t) {
switch (t.keyCode) {
case cc.macro.KEY.left:
this.accLeft = !0;
break;

case cc.macro.KEY.right:
this.accRight = !0;
break;

case cc.macro.KEY.a:
this.accLeft = !0;
break;

case cc.macro.KEY.d:
this.accRight = !0;
}
},
onKeyUp: function(t) {
switch (t.keyCode) {
case cc.macro.KEY.left:
this.accLeft = !1;
break;

case cc.macro.KEY.right:
this.accRight = !1;
break;

case cc.macro.KEY.a:
this.accLeft = !1;
break;

case cc.macro.KEY.d:
this.accRight = !1;
}
},
start: function() {},
update: function(t) {
this.accLeft ? this.xSpeed -= this.accel * t : this.accRight && (this.xSpeed += this.accel * t);
Math.abs(this.xSpeed) > this.maxMoveSpeed && (this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed));
this.node.x += this.xSpeed * t;
}
});
cc._RF.pop();
}, {} ],
Star: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "00aceG3ZDRDw4A1ebS0MRQT", "Star");
cc.Class({
extends: cc.Component,
properties: {
pickRadius: 0
},
getPlayerDistance: function() {
var t = this.game.player.getPosition();
return this.node.position.sub(t).mag();
},
onPicked: function() {
this.game.spawnNewStar();
this.game.gainScore();
this.node.destroy();
},
start: function() {},
update: function(t) {
if (this.getPlayerDistance() < this.pickRadius) this.onPicked(); else {
var e = 1 - this.game.timer / this.game.starDuration;
this.node.opacity = 50 + Math.floor(205 * e);
}
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "Game", "Player", "Star" ]);