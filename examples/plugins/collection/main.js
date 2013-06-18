enchant();

window.onload = function() {
    enchant.CollectiveSprite = enchant.Class.create(enchant.Sprite, {
        initialize: function(height, width) {
            enchant.Sprite.call(this, height, width);
            this.addEventListener('addedtoscene', function() {
                console.log('added');
                console.log(this.prototype);
                console.log(this);
                var prototype = Object.getPrototypeOf(this);
                if (prototype.constructor.collection) {
                    prototype.constructor.collection.push(this);
                } else {
                    prototype.constructor.collection = [this];
                }
            });
            this.addEventListener('removedfromscene', function() {
                console.log('removed');
                var prototype = Object.getPrototypeOf(this);
                var c = prototype.constructor.collection;
                c.splice(c.indexOf(this), 1);
            });
        },
        collection: {
            get: function() {
                var prototype = Object.getPrototypeOf(this);
                return prototype.constructor.collection;
            }, set: function(arr) {
                var prototype = Object.getPrototypeOf(this);
                prototype.constructor.collection = arr;
            }
        }
    });


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



    var collectiveProto = Object.getPrototypeOf(enchant.CollectiveSprite);

    collectiveProto.intersect = function(op, callback) {
        var i, leni, j, lenj;
        var myc = this.collection;
        var opc = op.collection;
        for (i = 0; leni = myc.length, i < leni; i++) {
            if (!myc[i] || !myc[i].intersect)break;
            for (j = 0; lenj = opc.length, j < lenj; j++) {
                if (!opc[j] || !opc[j].intersect)break;
                console.log('tested');
                if (myc[i].intersect(opc[j])) {
                    callback.apply(this, [myc[i], opc[j]]);
                    break;
                }
            }
        }
    };

    collectiveProto.intersectFilter = function(func) {

    }

    collectiveProto.intersectTapple = function(func) {

    }


    var game = new Game(320, 320);
    game.fps = 20;
    game.preload('chara1.png');
    game.onload = function() {
        bears = [];
        bears.push(new Bear());
        bears.push(new Bear());
        bears.push(new Bear());

        tamas = [];
        tamas.push(new Tama());
        tamas.push(new Tama());
        tamas.push(new Tama());

        console.log(bears);
        console.log(bears[0].collection);
        game.rootScene.onenterframe = function() {
            Bear.intersect(Tama, function(bear, tama) {
                console.log('intersect');
                game.rootScene.removeChild(bear);
            });
        }
    };
    game.start();

    function rand(num) {
        return Math.floor(Math.random() * num);
    }
};

