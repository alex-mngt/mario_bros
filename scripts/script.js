window.addEventListener('DOMContentLoaded', () => {

    // targetting elements & defining game properties

    let splashScreen = document.getElementsByClassName('splash-screen')[0];
    let deadScreen = document.getElementsByClassName('dead')[0];
    let deadScore = deadScreen.querySelector('.dead-score>span');
    let gameScore = document.querySelector('.game-score');
    let playButton = splashScreen.getElementsByClassName('play')[0];
    let playAgainButton = document.getElementsByClassName('play-again')[0];
    let play = false;
    let dead = false;
    let score = 0;

    let marioRest = document.querySelector('.mario.rest'),
        marioRunning1 = document.querySelector('.mario.running1'),
        marioRunning2 = document.querySelector('.mario.running2'),
        marioRunning3 = document.querySelector('.mario.running3'),
        marioJumping = document.querySelector('.mario.jumping'),
        marioArray = document.querySelectorAll('.mario'),
        marioRunningArray = document.querySelectorAll('.mario:not(.rest)'),
        ground = document.getElementsByClassName('ground')[0],
        sky = document.getElementsByClassName('sky')[0],
        clouds = document.getElementsByClassName('cloud');

    let rightArrowPressed = false;
    let leftArrowPressed = false;
    let runAnimationOver = true;
    let jumpAnimationOver = true;
    let jumping = false;
    let bouncing = false;
    let ascendant = true;

    let width = window.innerWidth;
    let height = window.innerHeight;

    let nbCellsOnScreen = 24;
    let groundCellWidth = width / nbCellsOnScreen;
    let nbCellsOffset = 2;
    let distanceCellsOffset = Math.trunc(groundCellWidth * nbCellsOffset);

    let groundPatternUnit = (groundCellWidth / 17).toFixed(5);
    let pixelUnit = (groundCellWidth / 16).toFixed(5);
    let cloudPositionUnit = (3 * width) / 6;

    let goombas = [];

    let cloudWidth = pixelUnit * 32;
    let cloudHeight = pixelUnit * 24
    let marioSpeed = groundCellWidth / 16
    let jumpHeight = groundCellWidth * 7;
    let jumpSpeed = height / 70;

    let groundTranslation = 0;

    let marioX = 0;
    let marioY = groundCellWidth * 2;
    let marioBoundingRect = marioRest.getBoundingClientRect();

    let soundtrack = new Audio('./assets/soundtrack.mp3');
    soundtrack.loop = true;
    soundtrack.volume = .3;

    let jumpSound = new Audio('./assets/jump.mp3');
    let kill = new Audio('./assets/enemystomp.mp3');

    playButton.addEventListener('click', () => {
        soundtrack.play();
        play = true;
        splashScreen.style.opacity = 0;
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 300)
    })

    playAgainButton.addEventListener('click', () => {
        window.location = './index.html';
    })

    // setup a ground larger than the screen and align it with the body

    ground.style.width = `calc(${width}px + ${groundCellWidth*4}px)`;
    ground.style.height = `${groundCellWidth*2}px`;
    sky.style.height = `calc(100vh - ${groundCellWidth*2}px)`
    ground.style.left = `-${groundCellWidth * nbCellsOffset}px`;
    ground.style.gridTemplateColumns = `repeat(${nbCellsOnScreen + (nbCellsOffset*2)}, ${groundCellWidth}px)`

    // define the patterns

    let groundPattern = [{
        top: groundPatternUnit,
        left: 0,
        width: groundPatternUnit * 10,
        height: groundPatternUnit,
        vertical: true,
        color: 'white'
    }, {
        top: groundPatternUnit * 12,
        left: 0,
        width: groundPatternUnit * 4,
        height: groundPatternUnit,
        vertical: true,
        color: 'white'
    }, {
        top: groundPatternUnit * 16,
        left: groundPatternUnit,
        width: groundPatternUnit * 7,
        height: groundPatternUnit,
        vertical: false,
        color: 'black'
    }, {
        top: 0,
        left: groundPatternUnit * 2,
        width: groundPatternUnit * 8,
        height: groundPatternUnit,
        vertical: false,
        color: 'white'
    }, {
        top: 0,
        left: groundPatternUnit * 10,
        width: groundPatternUnit * 10,
        height: groundPatternUnit,
        vertical: true,
        color: 'black'
    }, {
        top: 0,
        left: groundPatternUnit * 12,
        width: groundPatternUnit * 4,
        height: groundPatternUnit,
        vertical: false,
        color: 'white'
    }, {
        top: groundPatternUnit,
        left: groundPatternUnit * 16,
        width: groundPatternUnit * 4,
        height: groundPatternUnit,
        vertical: true,
        color: 'black'
    }, {
        top: groundPatternUnit,
        left: groundPatternUnit * 11,
        width: groundPatternUnit * 4,
        height: groundPatternUnit,
        vertical: true,
        color: 'white'
    }, {
        top: groundPatternUnit * 4,
        left: groundPatternUnit * 12,
        width: groundPatternUnit * 2,
        height: groundPatternUnit,
        vertical: true,
        color: 'black'
    }, {
        top: groundPatternUnit * 5,
        left: groundPatternUnit * 12,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: false,
        color: 'black'
    }, {
        top: groundPatternUnit * 6,
        left: groundPatternUnit * 11,
        width: groundPatternUnit * 5,
        height: groundPatternUnit,
        vertical: false,
        color: 'white'
    }, {
        top: groundPatternUnit * 7,
        left: groundPatternUnit * 11,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: true,
        color: 'white'
    }, {
        top: groundPatternUnit * 6,
        left: groundPatternUnit * 16,
        width: groundPatternUnit * 10,
        height: groundPatternUnit,
        vertical: true,
        color: 'black'
    }, {
        top: groundPatternUnit * 15,
        left: groundPatternUnit * 15,
        width: groundPatternUnit * 2,
        height: groundPatternUnit,
        vertical: true,
        color: 'black'
    }, {
        top: groundPatternUnit * 16,
        left: groundPatternUnit * 10,
        width: groundPatternUnit * 5,
        height: groundPatternUnit,
        vertical: false,
        color: 'black'
    }, {
        top: groundPatternUnit * 11,
        left: 0,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: false,
        color: 'black'
    }, {
        top: groundPatternUnit * 12,
        left: groundPatternUnit,
        width: groundPatternUnit * 2,
        height: groundPatternUnit,
        vertical: false,
        color: 'white'
    }, {
        top: groundPatternUnit * 12,
        left: groundPatternUnit * 3,
        width: groundPatternUnit * 2,
        height: groundPatternUnit,
        vertical: false,
        color: 'black'
    }, {
        top: groundPatternUnit * 13,
        left: groundPatternUnit * 3,
        width: groundPatternUnit * 2,
        height: groundPatternUnit,
        vertical: false,
        color: 'white'
    }, {
        top: groundPatternUnit * 13,
        left: groundPatternUnit * 5,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: false,
        color: 'black'
    }, {
        top: groundPatternUnit * 14,
        left: groundPatternUnit * 5,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: false,
        color: 'white'
    }, {
        top: groundPatternUnit * 13,
        left: groundPatternUnit * 8,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: true,
        color: 'black'
    }, {
        top: groundPatternUnit * 13,
        left: groundPatternUnit * 9,
        width: groundPatternUnit * 4,
        height: groundPatternUnit,
        vertical: true,
        color: 'white'
    }, {
        top: groundPatternUnit * 10,
        left: groundPatternUnit * 9,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: true,
        color: 'black'
    }, {
        top: groundPatternUnit * 10,
        left: groundPatternUnit * 10,
        width: groundPatternUnit * 3,
        height: groundPatternUnit,
        vertical: true,
        color: 'white'
    }];

    const marioRestPattern = [{
        top: 0,
        left: pixelUnit * 3,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit,
        left: pixelUnit * 2,
        width: pixelUnit * 9,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 2,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 5,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 3,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 4,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 3,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 3,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 7,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 3,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 2,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 5,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 4,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 8,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 10,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 3,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 5,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 9,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 10,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 11,
        left: 0,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 3,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 12,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 2,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 10,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 2,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 7,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 15,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 8,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }];

    const marioRunning1Pattern = [{
        top: 0,
        left: pixelUnit * 3,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit,
        left: pixelUnit * 2,
        width: pixelUnit * 9,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 2,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 5,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 3,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 4,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 3,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 3,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 7,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 3,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 3,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 2,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 9,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 2,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 9,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 3,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 11,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 2,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 12,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 2,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 6,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 13,
        left: 0,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 7,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }];

    const marioRunning2Pattern = [{
        top: 0,
        left: pixelUnit * 3,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit,
        left: pixelUnit * 2,
        width: pixelUnit * 9,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 2,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 5,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 3,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 4,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 3,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 3,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 7,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 3,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 3,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 4,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 4,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: 0,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 3,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 6,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 8,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 4,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 11,
        left: 0,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 3,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 7,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 3,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 6,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 2,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 6,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 2,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 2,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }];

    const marioRunning3Pattern = [{
        top: 0,
        left: pixelUnit * 6,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit,
        left: pixelUnit * 5,
        width: pixelUnit * 9,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 8,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 6,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 7,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 11,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 6,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 12,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 4,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 10,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 6,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 2,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 6,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 9,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 2,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 10,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 13,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 9,
        left: 0,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 4,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 6,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 12,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 14,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 4,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 14,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 3,
        width: pixelUnit * 10,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 13,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 2,
        width: pixelUnit * 11,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 13,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 3,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 10,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 13,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 2,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }];

    const marioJumpingPattern = [{
        top: 0,
        left: pixelUnit * 6,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: 0,
        left: pixelUnit * 13,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit,
        left: pixelUnit * 5,
        width: pixelUnit * 9,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit,
        left: pixelUnit * 14,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 8,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 13,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 6,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 7,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 11,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 14,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 6,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 12,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 4,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 10,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 6,
        width: pixelUnit * 7,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 13,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 3,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 7,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 8,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 12,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 2,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 12,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 9,
        left: 0,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 2,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 8,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 15,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 10,
        left: 0,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 6,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 9,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 10,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 12,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 13,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 14,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'skin'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 4,
        width: pixelUnit * 10,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 14,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 2,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 4,
        width: pixelUnit * 10,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 14,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 5,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 1,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 4,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'red'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'brown'
    }];

    const cloudPattern = [{
        top: 0,
        left: pixelUnit * 14,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit,
        left: pixelUnit * 13,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit,
        left: pixelUnit * 14,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit,
        left: pixelUnit * 18,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 11,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 13,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 19,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 11,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 19,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 21,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 11,
        width: pixelUnit * 9,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 20,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 21,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 22,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 11,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 17,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 18,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 23,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 9,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 10,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 13,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 15,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 18,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 19,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 23,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 12,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 13,
        width: pixelUnit * 10,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 23,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 8,
        width: pixelUnit * 16,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 24,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 27,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 5,
        width: pixelUnit * 19,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 24,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 26,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 27,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 9,
        left: pixelUnit * 28,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 3,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 4,
        width: pixelUnit * 21,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 25,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 26,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 28,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 3,
        width: pixelUnit * 25,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 28,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 30,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 3,
        width: pixelUnit * 26,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 29,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 30,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 31,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 13,
        left: 0,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit,
        width: pixelUnit * 30,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 31,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 14,
        left: 0,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit,
        width: pixelUnit * 30,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 31,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 2,
        width: pixelUnit * 28,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 30,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 16,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 16,
        left: pixelUnit * 3,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 16,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 16,
        left: pixelUnit * 6,
        width: pixelUnit * 11,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 16,
        left: pixelUnit * 17,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 16,
        left: pixelUnit * 18,
        width: pixelUnit * 11,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 16,
        left: pixelUnit * 29,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 3,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 4,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 6,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 9,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 10,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 16,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 17,
        width: pixelUnit * 13,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 17,
        left: pixelUnit * 30,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 5,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 7,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 11,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 14,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 18,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 22,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 23,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 18,
        left: pixelUnit * 31,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 19,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 19,
        left: pixelUnit * 5,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 19,
        left: pixelUnit * 10,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 19,
        left: pixelUnit * 16,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 19,
        left: pixelUnit * 17,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 19,
        left: pixelUnit * 22,
        width: pixelUnit * 9,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 20,
        left: pixelUnit * 5,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 20,
        left: pixelUnit * 8,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 20,
        left: pixelUnit * 12,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 20,
        left: pixelUnit * 14,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 20,
        left: pixelUnit * 18,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'blue'
    }, {
        top: pixelUnit * 20,
        left: pixelUnit * 21,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 20,
        left: pixelUnit * 29,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 21,
        left: pixelUnit * 8,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 21,
        left: pixelUnit * 9,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 21,
        left: pixelUnit * 15,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 21,
        left: pixelUnit * 16,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 21,
        left: pixelUnit * 24,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 21,
        left: pixelUnit * 25,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 21,
        left: pixelUnit * 27,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 22,
        left: pixelUnit * 9,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 22,
        left: pixelUnit * 11,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 22,
        left: pixelUnit * 14,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 22,
        left: pixelUnit * 16,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 22,
        left: pixelUnit * 18,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white'
    }, {
        top: pixelUnit * 22,
        left: pixelUnit * 22,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 22,
        left: pixelUnit * 25,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 23,
        left: pixelUnit * 11,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }, {
        top: pixelUnit * 23,
        left: pixelUnit * 18,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'black'
    }];

    const rightGoombaPattern = [{
        top: 0,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit,
        left: pixelUnit * 5,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 4,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 3,
        width: pixelUnit * 10,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 2,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 4,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 10,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 12,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 1,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 12,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 1,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 12,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 7,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 6,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 9,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 12,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 8,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 4,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 12,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 9,
        left: 0,
        width: pixelUnit * 16,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 10,
        left: pixelUnit,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 5,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 11,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 4,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 4,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 12,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 3,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 5,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 10,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 3,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 6,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 9,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 4,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 9,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }]

    const leftGoombaPattern = [{
        top: 0,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit,
        left: pixelUnit * 5,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 2,
        left: pixelUnit * 4,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 3,
        left: pixelUnit * 3,
        width: pixelUnit * 10,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 2,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 4,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 10,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 4,
        left: pixelUnit * 12,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 1,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 5,
        left: pixelUnit * 12,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 1,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 6,
        left: pixelUnit * 12,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 7,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 4,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 5,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 6,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 9,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 10,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 11,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 7,
        left: pixelUnit * 12,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 8,
        left: 0,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 4,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 8,
        left: pixelUnit * 12,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 9,
        left: 0,
        width: pixelUnit * 16,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 10,
        left: 0,
        width: pixelUnit * 16,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 10,
        left: pixelUnit,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 5,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 11,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 4,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 2,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 4,
        width: pixelUnit * 8,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 13,
        left: pixelUnit,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 6,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 13,
        left: pixelUnit * 11,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 14,
        left: pixelUnit,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 7,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 10,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 2,
        width: pixelUnit * 5,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 7,
        width: pixelUnit * 2,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 9,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }];

    const downGoombaPattern = [{
        top: pixelUnit * 9,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 10,
        left: pixelUnit * 3,
        width: pixelUnit * 10,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 2,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 3,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 10,
        width: pixelUnit * 3,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 11,
        left: pixelUnit * 13,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 2,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 6,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 10,
        width: pixelUnit * 4,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 12,
        left: pixelUnit * 14,
        width: pixelUnit,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 13,
        left: 0,
        width: pixelUnit * 16,
        height: pixelUnit,
        vertical: false,
        color: 'goomba-color',
    }, {
        top: pixelUnit * 14,
        left: pixelUnit * 2,
        width: pixelUnit * 12,
        height: pixelUnit,
        vertical: false,
        color: 'white',
    }, {
        top: pixelUnit * 15,
        left: 0,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }, {
        top: pixelUnit * 15,
        left: pixelUnit * 10,
        width: pixelUnit * 6,
        height: pixelUnit,
        vertical: false,
        color: 'black',
    }];

    // generate patterns function

    function generatePattern(pattern) {
        let markup = "";
        pattern.forEach(element => {
            markup = markup.concat(`<div style="top: ${element.top}px; left: ${element.left}px; width: ${element.width}px; height: ${element.height}px" class="${element.vertical ? 'vertical' : ''} ${element.color}"></div>`)
        });
        return markup;
    }

    // fill the ground with cells & fill cells with patterns

    function generateCells() {
        let markup = '';
        for (let i = 0; i < ((nbCellsOnScreen + (nbCellsOffset * 2)) * 2); i++) {
            markup = markup.concat(
                `<div class="ground-cell">
                    ${generatePattern(groundPattern)}
                </div>`
            );
        }
        return markup;
    }

    ground.innerHTML = generateCells();

    // create bounds 

    let boundsInitialPosition = (-1.2 * width) + (width / 2) - (groundCellWidth + (pixelUnit * 6));

    function generateBound(direction) {
        let bound = document.createElement('div');
        bound.classList.add('bound');
        bound.style.height = `${groundCellWidth}px`;
        bound.style.width = `${groundCellWidth}px`;
        bound.style.bottom = `${groundCellWidth*2}px`;
        if (direction === 'right') {
            bound.style.right = `${boundsInitialPosition}px`;
        } else if (direction === 'left') {
            bound.style.left = `${boundsInitialPosition}px`;
        }
        document.body.appendChild(bound);
    }

    generateBound('left');
    generateBound('right');

    // create Mario different states

    marioRest.style.height = `${pixelUnit * 16}px`;
    marioRest.style.width = `${pixelUnit * 12}px`;
    marioRest.style.bottom = `${groundCellWidth*2}px`;
    marioRest.innerHTML = `${generatePattern(marioRestPattern)}`;

    marioRunning1.style.height = `${pixelUnit * 16}px`;
    marioRunning1.style.width = `${pixelUnit * 12}px`;
    marioRunning1.style.bottom = `${groundCellWidth*2}px`;
    marioRunning1.innerHTML = `${generatePattern(marioRunning1Pattern)}`;

    marioRunning2.style.height = `${pixelUnit * 16}px`;
    marioRunning2.style.width = `${pixelUnit * 12}px`;
    marioRunning2.style.bottom = `${groundCellWidth*2}px`;
    marioRunning2.innerHTML = `${generatePattern(marioRunning2Pattern)}`;

    marioRunning3.style.height = `${pixelUnit * 16}px`;
    marioRunning3.style.width = `${pixelUnit * 16}px`;
    marioRunning3.style.bottom = `${groundCellWidth*2}px`;
    marioRunning3.style.marginLeft = `${pixelUnit *3}px`;
    marioRunning3.innerHTML = `${generatePattern(marioRunning3Pattern)}`;

    marioJumping.style.height = `${pixelUnit * 16}px`;
    marioJumping.style.width = `${pixelUnit * 16}px`;
    marioJumping.style.bottom = `${groundCellWidth*2}px`;
    marioJumping.style.marginLeft = `${pixelUnit *3}px`;
    marioJumping.innerHTML = `${generatePattern(marioJumpingPattern)}`;

    // generate clouds 

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function generateCloud(origin, position) {
        let cloud = document.createElement('div');
        cloud.style.height = `${cloudHeight}px`;
        cloud.style.width = `${cloudWidth}px`;
        cloud.style.bottom = `${height / getRandomArbitrary(1.2, 2)}px`;
        cloud.innerHTML = `${generatePattern(cloudPattern)}`;
        if (origin === 'left') {
            cloud.style.left = `${position}px`;
        } else if (origin === 'right') {
            cloud.style.right = `${position}px`
        }
        cloud.classList.add('cloud');
        document.body.appendChild(cloud);
    }

    generateCloud('left', -cloudPositionUnit);
    generateCloud('left', 0 - (cloudWidth / 2));
    generateCloud('left', cloudPositionUnit);
    generateCloud('right', 0 - (cloudWidth / 2));
    generateCloud('right', -cloudPositionUnit);

    function generateGoomba(origin) {
        const goombaStates = ['left', 'right', 'down'];
        let goombaWrapper = document.createElement('div');
        goombaWrapper.classList.add('goomba')
        goombaWrapper.style.bottom = `${groundCellWidth*2}px`;
        if (origin === 'left') {
            goombaWrapper.style.left = `${boundsInitialPosition}px`;
        } else if (origin === 'right') {
            goombaWrapper.style.right = `${boundsInitialPosition}px`;
        }
        goombaStates.forEach(goombaState => {
            let goomba = document.createElement('div');
            goomba.style.height = `${pixelUnit*16}px`;
            goomba.style.width = `${pixelUnit*16}px`;
            goomba.innerHTML = goombaState === 'left' ? `${generatePattern(leftGoombaPattern)}` : goombaState === 'right' ? `${generatePattern(rightGoombaPattern)}` : `${generatePattern(downGoombaPattern)}`;
            goomba.classList.add(goombaState, 'goombaState');
            goombaWrapper.appendChild(goomba);
        })
        document.body.appendChild(goombaWrapper);
        goombas = document.getElementsByClassName('goomba');
    }

    let goombaSettings = [];

    setInterval(() => {
        if (Math.round(Math.random())) {
            generateGoomba('left');
            goombaSettings.push({
                origin: 'left',
                translate: 0,
                goombaAnimationOver: true,
                alive: true
            })
        } else {
            generateGoomba('right');
            goombaSettings.push({
                origin: 'right',
                translate: 0,
                goombaAnimationOver: true,
                alive: true
            })
        }
    }, 10000);

    // listen to arrows states

    document.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') {
            leftArrowPressed = true;
        }
        if (event.key === 'ArrowRight') {
            rightArrowPressed = true;
        }
        if (event.key === 'ArrowUp') {
            if (jumpAnimationOver) {
                jumping = true;
                ascendant = true;
                jumpSound.play();
            }
        }
    });

    document.addEventListener('keyup', event => {
        if (event.key === 'ArrowRight') {
            rightArrowPressed = false;
        }
        if (event.key === 'ArrowLeft') {
            leftArrowPressed = false;
        }
    })

    // make mario run 

    function run() {
        runAnimationOver = false;
        marioRest.classList.remove('selected');
        if (leftArrowPressed && !runAnimationOver) {
            for (let i = 0; i < marioRunningArray.length; i++) {
                marioRunningArray[i].style.transform = 'scale(-1, 1)';
            }
        } else if (!runAnimationOver) {
            for (let i = 0; i < marioRunningArray.length; i++) {
                marioRunningArray[i].style.transform = 'scale(1)';
            }
        }
        marioRunningArray[0].classList.add('selected');
        setTimeout(() => {
            marioRunningArray[0].classList.remove('selected');
            if (rightArrowPressed || leftArrowPressed) {
                marioRunningArray[1].classList.add('selected');
                setTimeout(() => {
                    marioRunningArray[1].classList.remove('selected');
                    if (rightArrowPressed || leftArrowPressed) {
                        marioRunningArray[2].classList.add('selected');
                        setTimeout(() => {
                            marioRunningArray[2].classList.remove('selected');
                            runAnimationOver = true;
                            marioRest.classList.add('selected')
                        }, 200)
                    } else {
                        runAnimationOver = true;
                        marioRest.classList.add('selected')
                    }
                }, 200);
            } else {
                runAnimationOver = true;
                marioRest.classList.add('selected')
            }
        }, 200);
    }

    function goombaRun(index) {
        let goombaArray = goombas[index].querySelectorAll('div.goombaState');
        if (goombaSettings[index].goombaAnimationOver && goombaSettings[index].alive) {
            goombaSettings[index].goombaAnimationOver = false;
            goombaArray[0].classList.add('selected');
            setTimeout(() => {
                goombaArray[0].classList.remove('selected');
                goombaArray[1].classList.add('selected')
                setTimeout(() => {
                    goombaArray[1].classList.remove('selected');
                    goombaSettings[index].goombaAnimationOver = true;
                }, 200);
            }, 200);
        } else if (!goombaSettings[index].alive) {
            removeSelected(goombaArray);
            goombaArray[2].classList.add('selected');
        }
    }

    // move ground & clouds & stage

    function moveGround(direction) {
        if (direction === 'right') {
            groundTranslation -= marioSpeed;
            if (Math.trunc(-groundTranslation) !== distanceCellsOffset) {
                ground.style.transform = `translateX(${groundTranslation}px)`
            } else {
                ground.style.transform = `translateX(0)`;
                groundTranslation = 0;
            }
        } else {
            groundTranslation += marioSpeed;
            if (Math.trunc(groundTranslation) !== distanceCellsOffset) {
                ground.style.transform = `translateX(${groundTranslation}px)`
            } else {
                ground.style.transform = `translateX(0)`;
                groundTranslation = 0;
            }
        }

    }

    function moveClouds(distance) {
        clouds[0].style.left = `${(-cloudPositionUnit) - distance}px`;
        clouds[1].style.left = `${(0 - (cloudWidth / 2)) - distance}px`;
        clouds[2].style.left = `${cloudPositionUnit - distance}px`;
        clouds[3].style.right = `${(0 - (cloudWidth / 2)) + distance}px`;
        clouds[4].style.right = `${- cloudPositionUnit + distance}px`;
    }

    let bounds = document.getElementsByClassName('bound');

    function moveBounds(distance) {
        bounds[0].style.left = `${boundsInitialPosition - distance}px`;
        bounds[1].style.right = `${boundsInitialPosition + distance}px`;
    }


    function goombaFollow(distance) {
        for (let i = 0; i < goombas.length; i++) {
            if (rightArrowPressed || leftArrowPressed || jumping) {
                if (goombaSettings[i].origin === 'left') {
                    goombas[i].style.left = `${boundsInitialPosition - distance}px`;
                } else if (goombaSettings[i].origin === 'right') {
                    goombas[i].style.right = `${boundsInitialPosition + distance}px`;
                }
            }

            let goombaBoundingRect = goombas[i].getBoundingClientRect();

            if (goombaBoundingRect.x > width / 2 && goombaSettings[i].alive) {
                goombaSettings[i].translate--;
                goombas[i].style.transform = `translateX(${goombaSettings[i].translate}px)`
            } else if (goombaSettings[i].alive) {
                goombaSettings[i].translate++;
                goombas[i].style.transform = `translateX(${goombaSettings[i].translate}px)`
            }

            if ((marioBoundingRect.x + marioBoundingRect.width) > (goombaBoundingRect.x) && marioBoundingRect.x < (goombaBoundingRect.x + goombaBoundingRect.width) && goombaSettings[i].alive) {
                if (marioY - (groundCellWidth * 2) >= (pixelUnit * 16) - 40 && marioY - (groundCellWidth * 2) <= (pixelUnit * 16) + 40) {
                    bouncing = true;
                    goombaSettings[i].alive = false;
                    setTimeout(() => {
                        goombas[i].style.display = 'none';
                    }, 500)
                    kill.play();
                    score++;
                    gameScore.textContent = score;
                } else if (marioY - (groundCellWidth * 2) <= (pixelUnit * 16) - 40) {
                    play = false;
                    dead = true;
                }
            }
            goombaRun(i);
        }
    }

    // tool box 

    function removeSelected(array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].classList.contains('selected')) {
                array[i].classList.remove('selected');
            }
        }
    }

    function globalAnimation() {
        if (play) {
            if (jumping) {
                jumpAnimationOver = false;
                removeSelected(marioArray);
                marioJumping.classList.add('selected');
                if (marioY > jumpHeight) {
                    ascendant = false;
                    bouncing = false;
                }
                if (ascendant || bouncing) {
                    marioY += jumpSpeed;
                } else {
                    marioY -= jumpSpeed;
                }
                if (marioY <= groundCellWidth * 2) {
                    marioJumping.classList.remove('selected');
                    marioRest.classList.add('selected');
                    jumping = false;
                    jumpAnimationOver = true;
                }
                marioJumping.style.bottom = `${marioY}px`;
            }

            if (rightArrowPressed) {
                if (runAnimationOver && !jumping) {
                    run();
                }
                if (marioX < 1.2 * width) {
                    marioX += marioSpeed;
                    moveGround('right');
                    moveClouds(marioX);
                    moveBounds(marioX);
                }
            } else if (leftArrowPressed) {
                if (marioX > -1.2 * width) {
                    marioX -= marioSpeed;
                    moveGround('left');
                    moveClouds(marioX);
                    moveBounds(marioX);
                }
                if (runAnimationOver && !jumping) {
                    run();
                }
            }

            goombaFollow(marioX);

        }
        if (dead) {
            deadScreen.style.opacity = 1
            deadScore.textContent = score;
        }

        requestAnimationFrame(globalAnimation);
    }

    let animationLoop = requestAnimationFrame(globalAnimation);

});