enchant();


function setup() {
    bear = new Sprite(32, 32);
    bear.src = "chara1.png";
}

function draw() {
    bear.y = mouseY;

    game.rootScene.addEventListener('touchstart', function(evt) {
        shoot = new Sprite(16, 16);
        shoot.src = "icon0.png";
        shoot.frame = 29;
        shoot.y = evt.localY;
        shoot.tl.moveBy(360, 0, 90);
    });

    if (game.frame % 90 == 0) {
        white = SpriteClass.create(32, 32, function() {
            this.src = "chara1.png";
            this.x = 320;
            this.y = rand(320);
            this.frame = 5;
            this.tl.moveBy(-360, 0, 360).then(function() {
                game.end();
            });
        });
    } else if (game.frame % 100 == 30) {
        lady = new Sprite(32, 32);
        lady.src = "chara1.gif";
        lady.x = 320;
        lady.y = rand(320);
        lady.frame = 10;
        lady.tl.moveBy(-360, 0, 360);
    }

}

function rand(num) {
    return Math.floor(Math.random() * num);
}