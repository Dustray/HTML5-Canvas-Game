
var clip = new Array();//弹夹数组
var brickWarehouse = new Array();//砖块仓库数组
var propWarehouse = new Array();//道具仓库数组
var gunXPosition = 0;
var gunYPosition = 0;
var nowXPosition = 0;//滑块当前x轴位置
var nowYPosition = 0;//滑块当前y轴位置
var scoreAll = 0;//总分
var rewardMode = false;//奖励模式
var gunCount = 0;//霰弹枪子弹数量。
var xySpeed = new Array(2);//球xy方向速度
var xyBrickSpeed = new Array(2);//球xy方向速度
var aimShoot = false;

function shootBullet() {
    //  alert("sss"+nowXPosition+":"+ gunXPosition+":"+nowYPosition + ":"+gunYPosition);
    //console.log(xySpeed[0] + "+" + xySpeed[1]);
    //xySpeed = getXYSpeed(nowXPosition - gunXPosition, nowYPosition - gunYPosition);

    var bullet1 = new Bullet(this.context, nowXPosition, nowYPosition, 0, xySpeed[0], xySpeed[1]);
    clip.push(bullet1);
    if (rewardMode) {
        var bullet2 = new Bullet(this.context, nowXPosition, nowYPosition, 2, xySpeed[0], xySpeed[1]);
        var bullet3 = new Bullet(this.context, nowXPosition, nowYPosition, -2, xySpeed[0], xySpeed[1]);
        clip.push(bullet2);
        clip.push(bullet3);
    }

    //console.log("s")
}

//Movebar类，管理子弹
var UserBall = function (context, canvasWidth, canvasHeight) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    gunXPosition = canvasWidth / 2;
    gunYPosition = 0;
    nowXPosition = canvasWidth / 2;//当前userBall位置
    nowYPosition = canvasHeight * 2 / 3;//当前userBall位置

    this.shootInterval = setInterval(shootBullet, 100);//射击速度
};
UserBall.prototype.moveTo = function (x, y) {

    //var y = this.canvasHeight - 10;//e.pageY - canvas.clientTop;
    context.beginPath();
    this.context.fillStyle = "#009688";
    if (aimShoot) {
        context.arc(nowXPosition, nowYPosition, 10, 0, 2 * Math.PI, true);
    } else {
        context.arc(x, y, 10, 0, 2 * Math.PI, true);
    }
    //context.rect(x - 20, y, 40, 6);

    context.fill();

    if (aimShoot) {//瞄准射击
        gunXPosition = x;
        gunYPosition = y;
    } else {//移动模式
        gunXPosition = this.canvasWidth / 2;
        gunYPosition = this.canvasHeight / 2;
        nowXPosition = x;
        nowYPosition = y;
    }
    //console.log(nowXPosition + "+" + gunXPosition + "s" + nowYPosition + "+" + gunYPosition);

    xySpeed = getXYSpeed(gunXPosition - nowXPosition, gunYPosition - nowYPosition, 10);


};
UserBall.prototype.shoot = function () {
    //alert("s" + clip.length);
    if (aimShoot) {//瞄准射击
        context.beginPath();
        context.moveTo(nowXPosition, nowYPosition);
        context.lineTo(gunXPosition, gunYPosition);

        context.lineWidth = 5;
        context.strokeStyle = "red";
        context.stroke();
    }
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
            if (Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow(y1 - y2, 2)) < 15) {
                //碰撞成功
                var score = document.getElementById("score");
                score.innerHTML = "分数：" + ++scoreAll;
                if (scoreAll % 50 == 0 && rewardMode == false) {//开启奖励模式
                    rewardMode = true;
                    setTimeout("rewardMode=false;", 5000);
                } else if (scoreAll % 20 == 0) {//奖励霰弹丸
                    //gunCount++;
                    var gunBullet = document.getElementById("gun");
                    gunBullet.innerHTML = "霰弹丸：" + ++gunCount;

                }

                clip.splice(i, 1);
                brickWarehouse.splice(j, 1);

            }
        }
    }
};
UserBall.prototype.gunShoot = function () {
    for (i = -5; i <= 5; i++) {

        var xySpeed = getXYSpeed(gunXPosition - nowXPosition, gunYPosition - nowYPosition, 10);
        var bullet = new Bullet(this.context, nowXPosition, this.canvasHeight, i, xySpeed[0], xySpeed[1]);
        clip.push(bullet);
    }

}

//子弹实体类
var Bullet = function (context, xPosition, yPosition, Offset, xSpeed, ySpeed) {
    this.context = context;
    this.x = xPosition;
    this.y = yPosition;
    this.Offset = Offset;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
}
Bullet.prototype.shootOne = function () {
    context.beginPath();
    context.fillStyle = "#000";
    context.arc(this.x, this.y, 5, 0, 2 * Math.PI, true);
    context.fill();
    this.y += this.ySpeed + this.Offset;
    this.x += this.xSpeed + this.Offset;
    if (this.y < 0)
        return -1;
    else
        return 0;
}

//砖块管理类
var BrickManage = function (context, canvasWidth, canvasHeight) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    setInterval(function () {
        var x = Math.round(Math.random() * canvasWidth);//均衡获取50到cWidth-50的随机整数
        var y = Math.round(Math.random() * canvasHeight);//均衡获取50到cWidth-50的随机整数
        var direction = Math.round(Math.random() * 3);
        //console.log(direction);
        var brick;
        switch (direction) {
            case 0:
                brick = new Brick(this.context, 30, y);
                break;
            case 1:
                brick = new Brick(this.context, canvasWidth, y);
                break;
            case 2:
                brick = new Brick(this.context, x, 30);
                break;
            case 3:
                brick = new Brick(this.context, x, canvasHeight);
                break;
        }
        brickWarehouse.push(brick);
        //
        //console.log("s")
    }, 400);//出砖块速度
};
BrickManage.prototype.reflesh = function () {
    //alert("s" + clip.length);
    for (var i = 0; i < brickWarehouse.length; i++) {
        brickWarehouse[i].downMove();
        //碰撞检测
        var x1 = nowXPosition, y1 = nowYPosition;
        var x2 = brickWarehouse[i].x;
        var y2 = brickWarehouse[i].y;
        if (Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow(y1 - y2, 2)) < 20) {
            //碰撞成功
            //此处应结束游戏
            alert("GAME OVER  总分：" + scoreAll);
            clip.splice(0, clip.length);//清空数组 
            brickWarehouse.splice(0, brickWarehouse.length);//清空数组 
            scoreAll = 0;
            gunCount = 0;
            continue;
            //
        }
    }

};
//砖块实体类
var Brick = function (context, xPosition, yPosition) {
    this.context = context;
    this.x = xPosition;
    this.y = yPosition;
    this.ballColor = '#' + Math.floor(Math.random() * 16777210 + 5).toString(16);//16777215
    //console.log(this.x+"s"+this.y+"s");
}
Brick.prototype.downMove = function () {


    context.beginPath();
    context.fillStyle = this.ballColor;
    context.strokeStyle = "#333";
    context.lineWidth = 2;
    context.arc(this.x, this.y, 10, 0, 2 * Math.PI, true);
    context.stroke();
    context.fill();


    xyBrickSpeed = getXYSpeed(nowXPosition - this.x, nowYPosition - this.y, 1);
    this.x += xyBrickSpeed[0];
    this.y += xyBrickSpeed[1];

}

//根据总速度获取x轴y轴分速度
function getXYSpeed(x, y, allSpeed) {
    // x = 3; y = 4;
    // alert(x+"s"+y);
    var xySpeeds = Array(2);
    var a = allSpeed;
    var xSpeed, ySpeed;
    if (x != 0) {
        xSpeed = Math.sqrt(a * a / (1 + ((y * y) / (x * x))));
    } else {
        xSpeed = xySpeed[0];
    }
    if (y != 0) {

        ySpeed = Math.sqrt(a * a / (1 + ((x * x) / (y * y))));
    } else {
        ySpeed = xySpeed[1];
    }
    //var xa = (x * x) / (y * y);
    //alert(""+xa);
    if (x < 0) xSpeed = -xSpeed;
    if (y < 0) ySpeed = -ySpeed;
    xySpeeds[0] = xSpeed;
    xySpeeds[1] = ySpeed;
    // alert(xSpeed+"+"+ ySpeed);
    return xySpeeds;
}

//道具管理类
var PropManage = function (context, canvasWidth, canvasHeight) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    setInterval(function () {
        var x = Math.round(Math.random() * canvasWidth);//均衡获取50到cWidth-50的随机整数
        var y = Math.round(Math.random() * canvasHeight);//均衡获取50到cWidth-50的随机整数
        
        var propType = Math.round(Math.random() * 2+1);
        console.log(propType);
        var prop = new Prop(this.context, x, y, propType);

        propWarehouse.push(prop);
        //
        //console.log("s")
    }, 10000);//出道具速度
};
PropManage.prototype.reflesh = function () {
    //alert("s" + clip.length);
    for (var i = 0; i < propWarehouse.length; i++) {
        propWarehouse[i].generate();
        //碰撞检测
        var x1 = nowXPosition, y1 = nowYPosition;
        var x2 = propWarehouse[i].x;
        var y2 = propWarehouse[i].y;
        if (Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow(y1 - y2, 2)) < 30) {
            //碰撞成功,道具生效
            propWarehouse.splice(i, 1);
            switch(propWarehouse[i]){
                case 1:
                
                setTimeout("rewardMode=false;", 5000);
                    break;
                case 2:
                    this.propColor = "#E91E63";
                    this.hint = "擦";
                    break;
                case 3:
                    this.propColor = "#00BCD4";
                    this.hint = "镖";
                    break;
            }
            continue;
            //
        }
    }

};

//道具实体类
var Prop = function (context, xPosition, yPosition, type) {
    this.context = context;
    this.x = xPosition;
    this.y = yPosition;
    this.type = type;
    this.propColor = "#000";
    this.hint = "枪";
    //console.log(this.x+"s"+this.y+"s");
}
Prop.prototype.generate = function () {
    switch (this.type) {
        case 1:
            this.propColor = "#8BC34A";
            this.hint = "枪";
            break;
        case 2:
            this.propColor = "#E91E63";
            this.hint = "擦";
            break;
        case 3:
            this.propColor = "#00BCD4";
            this.hint = "镖";
            break;
    }

    context.beginPath();
    context.fillStyle = this.propColor;
    context.strokeStyle = "#607D8B";
    context.lineWidth = 5;
    context.arc(this.x, this.y, 20, 0, 2 * Math.PI, true);
    context.stroke();
    context.fill();

    context.beginPath();
    context.font = "18px Arial";
    context.textAlign = 'center';
    context.fillStyle = "#fff";
    context.fillText(this.hint, this.x, this.y + 6);
    context.fill();


}