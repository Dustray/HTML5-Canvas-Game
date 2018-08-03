
var clip = new Array();
var brickWarehouse = new Array();
var nowXPosition = 0;
var MoveBar = function (context, canvasWidth, canvasHeight) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    nowXPosition = canvasWidth / 2;//当前moveBar位置
    setInterval(function () {
        var buttet = new Bullet(this.context, nowXPosition, canvasHeight);
        clip.push(buttet);
        //console.log("s")
    }, 100);//射击速度
};
MoveBar.prototype.moveTo = function (x) {
    if (x - 20 < 0 || x + 20 > this.canvasWidth)
        return;//若x位置超出边界就停止
    var y = this.canvasHeight - 10;//e.pageY - canvas.clientTop;
    context.beginPath();
    context.arc(x, y - 5, 5, 0, 2 * Math.PI, true);
    context.rect(x - 20, y, 40, 6);
    context.fill();
    nowXPosition = x;
};
MoveBar.prototype.shoot = function () {
    //alert("s" + clip.length);
    for (var i = 0; i < clip.length; i++) {
        if (clip[i].shootOne() == -1) {
            clip.splice(i, 1);
            continue;
        }
        var x1 = clip[i].x;
        var y1 = clip[i].y;
        //碰撞检测
        for (var j = 0; j < brickWarehouse.length; j++) {
            var x2 = brickWarehouse[j].x;
            var y2 = brickWarehouse[j].y;
            if (Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow(y1 - y2, 2)) < 25) {
                //碰撞成功
                if (brickWarehouse[j].remainTimes > 1) {
                    brickWarehouse[j].remainTimes--;
                    clip.splice(i, 1);
                } else {
                    clip.splice(i, 1);
                    brickWarehouse.splice(j, 1);
                }
            }
        }
    }
};

var Bullet = function (context, xPosition, yPosition) {
    this.context = context;
    this.x = xPosition;
    this.y = yPosition;
}
Bullet.prototype.shootOne = function () {
    context.beginPath();
    context.fillStyle="#000";
    context.arc(this.x, this.y - 15, 5, 0, 2 * Math.PI, true);
    context.fill();
    this.y -= 10;
    if (this.y < 0)
        return -1;
    else
        return 0;
}


var BrickManage = function (context, canvasWidth, canvasHeight) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    setInterval(function () {
        var x = Math.round(Math.random() * (canvasWidth - 100) + 50);//均衡获取50到cWidth-50的随机整数
        var brick = new Brick(this.context, x, canvasHeight);
        brickWarehouse.push(brick);
        //console.log("s")
    }, 1000);//出砖块速度
};
BrickManage.prototype.reflesh = function () {
    //alert("s" + clip.length);
    for (var i = 0; i < brickWarehouse.length; i++) {
        if (brickWarehouse[i].downMove() == -1) {
            //此处应结束游戏
            alert("GAME OVER");
            clip.splice(0,clip.length);//清空数组 
            brickWarehouse.splice(0,brickWarehouse.length);//清空数组 
            //
            brickWarehouse.splice(i, 1);
            continue;
        }
    }
};

var Brick = function (context, xPosition, canvasHeight) {
    this.context = context;
    this.x = xPosition;
    this.y = 30;
    this.canvasHeight = canvasHeight;
    this.remainTimes = Math.round(Math.random() * (6) + 5);//均衡获取5到10的随机整数;
}
Brick.prototype.downMove = function () {
    context.beginPath();
    context.fillStyle="#000"
    context.arc(this.x, this.y, 20, 0, 2 * Math.PI, true);
    context.fill();
    
    context.beginPath();
    context.font="bold 15px Arial"
    context.textAlign='center';
    context.fillStyle="#fff";
    context.fillText(this.remainTimes,this.x, this.y+5);
    context.fill();
    this.y += 1;
    if (this.y > this.canvasHeight)
        return -1;
    else
        return 0;
}