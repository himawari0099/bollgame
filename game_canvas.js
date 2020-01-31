var canvas = document.getElementById("myCanvas");// canvas要素に映像を描画するために、まずはJavscriptから要素への参照を取得
var ctx = canvas.getContext("2d");// canvas要素に映像を描画するために、まずはJavscriptから要素への参照を取得
var ballRadius = 10;
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
// ボールに当たるパズル定義
var paddleHeight = 10;
var paddleWidth = 75;
// パドルを操作できるようにする
// keydownイベントとkeyupイベントの2つのイベントリスナー。ボタンが押されたときにパドルの動きを扱うコードを走らせたい
var paddleX = (canvas.width-paddleWidth)/2;
// 行と列の情報を定義するいくつかの変数
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

// 1つの2次元配列で全てのブロックを記録//2次元配列はブロックの列 (c) を含んでおり、列は行 (r) を含み、行はそれぞれのブロックが描画される画面上のx座標とy座標をもつオブジェクトを含む
var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
bricks[c] = [];
for(var r=0; r<brickRowCount; r++) {
bricks[c][r] = { x: 0, y: 0, status: 1 };
}
}
// ボタンが押されたのを検知するため、2つのイベントリスナーを設定します。

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);//マウスの動作を監視する


// キーボードのキーのどれかに対してkeydownイベントが発火したとき (どれかが押されたとき) 、keyDownHandler()関数が実行されます。
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}
//パドルの動きをマウスの動きと紐付ける。パドルの位置をカーソルの座標に基づいて更新することができます。
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
var relativeX = e.clientX - canvas.offsetLeft;
if(relativeX > 0 && relativeX < canvas.width) {
paddleX = relativeX - paddleWidth/2;
}
}
function collisionDetection() {
for(var c=0; c<brickColumnCount; c++) {
for(var r=0; r<brickRowCount; r++) {
    var b = bricks[c][r];
    if(b.status == 1) {
    if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
        dy = -dy;
        b.status = 0;
        score++;
        if(score == brickRowCount*brickColumnCount) {
        alert("YOU WIN, CONGRATS!");
        document.location.reload();
        }
    }
    }
}
}
}
// ここではcanvas要素への参照をcanvasに保存している。それから2db描画コンテキストを保存するためにctxを変数を作成
function drawBall() {
ctx.beginPath();
ctx.arc(x, y, ballRadius, 0, Math.PI*2);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
}
function drawPaddle() {
ctx.beginPath();
ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
ctx.fillStyle = "#0095DD";
ctx.fill();
ctx.closePath();
}
function drawBricks() { // 配列に含まれる全てのブロックを通してループする関数を作成し、画面上に描画しましょう。コードは次のようになります。
for(var c=0; c<brickColumnCount; c++) {
for(var r=0; r<brickRowCount; r++) {
// ブロックのx座標とy座標を導出する計算を一回一回のループに含める必要があります。
    if(bricks[c][r].status == 1) {//ここのif文はそれぞれのブロックを描画する前にstatusプロパティの値をdrawBricks()関数で確認します。もしstatusが1なら描画します。
    var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
    var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
    bricks[c][r].x = brickX;
    bricks[c][r].y = brickY;
    ctx.beginPath();
    ctx.rect(brickX, brickY, brickWidth, brickHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    }
}
}
}
// スコア表示を作成し更新するためにdrawScore()関数も必要です。
function drawScore() {
ctx.font = "16px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Score: "+score, 8, 20);
}
// ライフカウンタを描画するのはスコアカウンタを描画するのとほとんど同じ
function drawLives() {
ctx.font = "16px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawBricks();
drawBall();
drawPaddle();
drawScore();
drawLives();
collisionDetection();

if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
dx = -dx;
}
if(y + dy < ballRadius) {
dy = -dy;
}
else if(y + dy > canvas.height-ballRadius) {
if(x > paddleX && x < paddleX + paddleWidth) {
    dy = -dy;
}
else {
    lives--;
    if(!lives) {
    alert("GAME OVER");
    document.location.reload();
    }
    else {
    x = canvas.width/2;
    y = canvas.height-30;
    dx = 3;
    dy = -3;
    paddleX = (canvas.width-paddleWidth)/2;
    }
}
}

if(rightPressed && paddleX < canvas.width-paddleWidth) {
paddleX += 7;
}
else if(leftPressed && paddleX > 0) {
paddleX -= 7;
}

x += dx;
y += dy;
requestAnimationFrame(draw);
}

draw();