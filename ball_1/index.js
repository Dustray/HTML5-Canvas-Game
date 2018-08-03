
var clip = new Array();//弹夹数组
var brickWarehouse = new Array();//砖块仓库数组
var nowXPosition = 0;//滑块当前x轴位置
var scoreAll = 0;//总分
var rewardMode = false;//奖励模式
var gunCount = 0;//霰弹枪子弹数量。
var ballMoreColor = true, isDog = false;

var MoveBar = function (context, canvasWidth, canvasHeight) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    nowXPosition = canvasWidth / 2;//当前moveBar位置
    this.img = new Image();
    this.frm = 1;
    this.x = nowXPosition;
    setInterval(function () {

        var bullet1 = new Bullet(this.context, nowXPosition, canvasHeight, 0);
        clip.push(bullet1);
        if (rewardMode) {
            var bullet2 = new Bullet(this.context, nowXPosition, canvasHeight, 2);
            var bullet3 = new Bullet(this.context, nowXPosition, canvasHeight, -2);
            clip.push(bullet2);
            clip.push(bullet3);
        }

        //console.log("s")
    }, 100);//射击速度
};
MoveBar.prototype.reflesh = function () {
    if (this.x - 20 < 0 || this.x + 20 > this.canvasWidth)
        return;//若x位置超出边界就停止
    var y = this.canvasHeight - 60;//e.pageY - canvas.clientTop;

    if (this.x < nowXPosition) {
        this.frm = 0;
    } else if (this.x == nowXPosition) {
        this.frm = 1;
    } else {
        this.frm = 2;
    }
    context.save();
    this.img.src = "plane.png";
    context.drawImage(this.img, this.frm * 500, 0, 500, 500, this.x - 35, y, 70, 70);
    context.restore();

    nowXPosition = this.x;
}
MoveBar.prototype.moveTo = function (x) {
    this.x = x;
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
            if (Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow(y1 - y2, 2)) < 23) {
                //碰撞成功

                gameInfo.score = ++scoreAll;
                if (scoreAll % 50 == 0 && rewardMode == false) {//开启奖励模式
                    rewardMode = true;
                    setTimeout("rewardMode=false;", 5000);
                } else if (scoreAll % 20 == 0) {//奖励霰弹丸

                    gameInfo.gun = ++gunCount;
                }
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
MoveBar.prototype.gunShoot = function () {
    for (i = -10; i <= 10; i++) {
        var bullet = new Bullet(this.context, nowXPosition, this.canvasHeight, i);
        clip.push(bullet);
    }

}

var Bullet = function (context, xPosition, yPosition, xOffset) {
    this.context = context;
    this.x = xPosition;
    this.y = yPosition;
    this.xOffset = xOffset;
}
Bullet.prototype.shootOne = function () {
    context.beginPath();
    context.fillStyle = "#000";
    context.arc(this.x, this.y - 15, 3, 0, 2 * Math.PI, true);
    context.fill();
    this.y -= 10;
    this.x += this.xOffset;
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
            alert("GAME OVER  总分：" + scoreAll);
            clip.splice(0, clip.length);//清空数组 
            brickWarehouse.splice(0, brickWarehouse.length);//清空数组 
            scoreAll = 0;
            gunCount = 0;
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
    this.ballColor = ballMoreColor ? '#' + Math.floor(Math.random() * 16777210 + 5).toString(16) : "#000";
    //this.isDog = false;
}
Brick.prototype.downMove = function () {
    context.beginPath();
    context.fillStyle = isDog ? '#' + Math.floor(Math.random() * 16777210 + 5).toString(16) : this.ballColor;
    context.strokeStyle = "#888";
    context.lineWidth = 5;
    context.arc(this.x, this.y, 20, 0, 2 * Math.PI, true);
    context.stroke();
    context.fill();

    context.beginPath();
    context.font = "bold 15px Arial";
    context.textAlign = 'center';
    context.fillStyle = "#fff";
    context.fillText(this.remainTimes, this.x, this.y + 5);
    context.fill();
    this.y += 1;
    if (this.y > this.canvasHeight)
        return -1;
    else
        return 0;
}
var ShowGameInfo = function (context) {
    this.context = context;
    this.score = 0;
    this.gun = 0;
}
ShowGameInfo.prototype.reflesh = function () {

    var text = "分数：" + this.score + " 霰弹丸：" + this.gun;
    context.textAlign="center";
    context.beginPath();
    context.font = "25px Arial";
    context.fillStyle = "#fff";
    context.fillText(text, 115, 30);
    context.fill();
}