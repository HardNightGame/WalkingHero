var canvasWidth = 600;//window.innerWidth;
var canvasHeight = 500;//window.innerHeight;
var direction = '';

var centerMap = {
    X: canvasWidth / 2 - 48 / 2,
    Y: canvasHeight / 2 - 49 / 2
}

var stage = new Konva.Stage({
    container: 'container',
    width: canvasWidth,
    height: canvasHeight
});

var layer = new Konva.Layer();

var playerImg = new Image();
playerImg.src = 'js/hero.png';

var animationsPlayer = {
    idleRight: [ // игрок стоит и смотрит вправо
        2, 10, 48, 49,
        52, 10, 48, 49,
        102, 10, 48, 49,
        152, 10, 48, 49,
        202, 10, 48, 49,
        252, 10, 48, 49,
        302, 10, 48, 49,
        352, 10, 48, 49
    ],
    walkRight: [
        2, 131, 48, 49,
        58, 131, 48, 49,
        114, 131, 48, 49,
        170, 131, 48, 49,
        226, 131, 48, 49,
        282, 131, 48, 49,
        338, 131, 48, 49,
        394, 131, 48, 49,
        450, 131, 48, 49,
        506, 131, 48, 49,
        562, 131, 48, 49,
        618, 131, 48, 49,
        674, 131, 48, 49,
        730, 131, 48, 49,
        786, 131, 48, 49,
        842, 131, 48, 49,
        898, 131, 48, 49,
        954, 131, 48, 49
    ],
    walkLeft: [
        2, 191, 48, 49,
        58, 191, 48, 49,
        114, 191, 48, 49,
        170, 191, 48, 49,
        226, 191, 48, 49,
        282, 191, 48, 49,
        338, 191, 48, 49,
        394, 191, 48, 49,
        450, 191, 48, 49,
        506, 191, 48, 49,
        562, 191, 48, 49,
        618, 191, 48, 49,
        674, 191, 48, 49,
        730, 191, 48, 49,
        786, 191, 48, 49,
        842, 191, 48, 49,
        898, 191, 48, 49,
        954, 191, 48, 49
    ],
    idleLeft: [
        2, 72, 48, 49,
        52, 72, 48, 49,
        102, 72, 48, 49,
        152, 72, 48, 49,
        202, 72, 48, 49,
        252, 72, 48, 49,
        302, 72, 48, 49,
        352, 72, 48, 49
    ]
};

// задаем параметры изображения спрайта игрока
var player = new Konva.Sprite({
    x: 100 - 48 / 2, // положение
    y: 150 - 49 / 2,
    image: playerImg,
    animation: 'idleRight',
    animations: animationsPlayer, // изображение со всеми анимациями
    frameRate: 5, // скорость смены кадров
    frameIndex: 0 // начальный кадр
});

// добавляем спрайт игрока на игровой слой
layer.add(player);

// добавляем слой на стейдж
stage.add(layer);

// запускаем анимацию игрока
player.start();

var wait = false;

function setWait() {
    if (!wait) {
        setTimeout(() => wait = false, 3000)
    }
    wait = true;
}

function moveUp() {
    player.attrs.animation = 'walkLeft';
    direction = 'up';
    if (player.attrs.y - 1 > 0) player.setY(player.attrs.y - 1);
}

function moveDown() {
    player.attrs.animation = 'walkRight';
    direction = 'down';
    if (player.attrs.y + 1 < canvasHeight - 48) player.setY(player.attrs.y + 1);
}

function moveLeft() {
    player.attrs.animation = 'walkLeft';
    direction = 'left';
    if (player.attrs.x - 1 > 0) player.setX(player.attrs.x - 1);
}

function moveRight() {
    player.attrs.animation = 'walkRight';
    direction = 'right';
    if (player.attrs.x + 1 < canvasWidth - 48) player.setX(player.attrs.x + 1);
}

function handleInput() {

    player.attrs.animation = 'idleRight'; // движение по умолчанию
    if (direction == 'left' || direction == 'down') {
        player.attrs.animation = 'idleLeft';
    }

    if (input.isDown('DOWN') || input.isDown('s')) {
        moveDown();
        setWait();
    }

    if (input.isDown('UP') || input.isDown('w')) {
        moveUp()
        setWait();
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        moveLeft();
        setWait();
    }

    if (input.isDown('RIGHT') || input.isDown('d')) {
        moveRight();
        setWait();
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}

var waitMove = 0;
var waitMoveDirection;

// бесконечный цикл игры
var gameLoop = new Konva.Animation(function (frame) {
        handleInput();
        if (!wait) {
            if (waitMoveDirection !== -1) {
                if (waitMove === 0) {
                    waitMove = getRandomInt(30) + 30;
                    waitMoveDirection = getRandomInt(8);
                    // 1 2 3
                    // 4   5
                    // 6 7 8
                }

                if (waitMoveDirection >= 1 && waitMoveDirection <= 3)
                    moveUp();
                if (waitMoveDirection >= 6 && waitMoveDirection <= 8)
                    moveDown();
                if (waitMoveDirection === 1 || waitMoveDirection === 4 || waitMoveDirection === 6)
                    moveLeft();
                if (waitMoveDirection === 3 || waitMoveDirection === 5 || waitMoveDirection === 8)
                    moveRight();

                waitMove--;

                if ((player.attrs.y - 1 <= 0) || (player.attrs.y + 1 >= canvasHeight - 48) ||
                    (player.attrs.x - 1 <= 0) || (player.attrs.x + 1 >= canvasWidth - 48)) {
                    waitMoveDirection = -1;
                }
            } else {
                if (player.attrs.x > centerMap.X) {
                    moveLeft();
                } else if (player.attrs.x < centerMap.X) {
                    moveRight();
                }

                if (player.attrs.y > centerMap.Y) {
                    moveUp();
                } else if (player.attrs.y < centerMap.Y) {
                    moveDown();
                }

                if ((Math.abs(player.attrs.y - centerMap.Y) < 1) &&
                    (Math.abs(player.attrs.x - centerMap.X) < 1)) {
                    waitMoveDirection = 0;
                    waitMove = 0;
                }
            }
        }
    },
    layer
    )
;
gameLoop.start();


