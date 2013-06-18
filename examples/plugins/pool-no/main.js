enchant();

window.onload = function() {
    Tama = enchant.Class.create(enchant.Sprite, {
        initialize: function() {
            console.log('sprite initialize');

            enchant.Sprite.call(this, 32, 32);
            this.image = game.assets['chara1.png'];
            this.frame = 0;
            this.vx = 0;
            this.vy = 0;

            this.addEventListener('enterframe', function() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation = Math.atan2(this.vy, this.vx) / Math.PI * 180;
                if(this.x > game.width || this.y > game.height || this.x < -this.width || this.y < -this.height){
                    this.scene.removeChild(this);
                }
            });
        }
    });

    var game = new Game(320, 320);
    game.fps = 30;
    game.preload('chara1.png');
    game.onload = function() {
        var label = new Label('test');
        label.backgroundColor = 'white';
        game.rootScene.addChild(label);

        game.rootScene.addEventListener('enterframe', function(evt) {
            if(game.rootScene.age % 10 == 0){
                var num = 60;
                var rad_span = Math.PI * 2 / num;
                var rad_offset = rad_span / 11 * (game.rootScene.age % 11);
                for(var i = 0; i < num; i++){
                    var tama = new Tama();
                    var rad = rad_span * i + rad_offset;
                    tama.vx = Math.sin(rad);
                    tama.vy = Math.cos(rad);
                    tama.moveTo(160, 160);
                    game.rootScene.insertBefore(tama, label);
                }
                var fps = Math.round(10000 / evt.elapsed)/10;
                var log = ['fps:', fps].join(' ');
                label.text = log;
                console.log(log);
            }
        });
    };
    game.start();

    /**
    Bear = enchant.Class.create(enchant.CollectiveSprite, {
        initialize: function() {
            enchant.CollectiveSprite.call(this, 32, 32);
            this.image = game.assets['chara1.png'];
            this.frame = 0;
            this.moveTo(rand(300), rand(300));
            game.rootScene.addChild(this);
        }
    });

    Tama = enchant.Class.create(enchant.CollectiveSprite, {
        initialize: function() {
            enchant.CollectiveSprite.call(this, 32, 32);
            this.image = game.assets['chara1.png'];
            this.frame = 5;
            this.moveTo(rand(300), -64);
            this.tl.moveBy(0, 320, 90);
            game.rootScene.addChild(this);
        }
    });

    var game = new Game(320, 320);
    game.fps = 20;
    game.preload('chara1.png');
    game.onload = function() {
        Bear.alloc(256);
        bears = [];
        bears.push(Bear.getInstance());
        bears.push(Bear.getInstance());
        bears.push(Bear.getInstance());

        tamas = [];
        tamas.push(new Tama());
        tamas.push(new Tama());
        tamas.push(new Tama());

        console.log(bears);
        console.log(bears[0].collection);
        game.rootScene.onenterframe = function() {
            Bear.intersect(Tama, function(bear, tama) {
                game.rootScene.removeChild(bear);
            });
        }
    };
    game.start();

    function rand(num) {
        return Math.floor(Math.random() * num);
    }
    **/
};

