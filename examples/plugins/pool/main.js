enchant();

window.onload = function() {
    enchant.CollectiveSprite = enchant.Class.create(enchant.Sprite, {
        initialize: function(height, width) {
            enchant.Sprite.call(this, height, width);
            this.addEventListener('addedtoscene', function() {
                var prototype = Object.getPrototypeOf(this);
                if (prototype.constructor.collection) {
                    prototype.constructor.collection.push(this);
                } else {
                    prototype.constructor.collection = [this];
                }
            });
            this.addEventListener('removedfromscene', function() {
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
        },
        objects: {
            get: function() {
                var prototype = Object.getPrototypeOf(this);
                return prototype.constructor.objects;
            }, set: function(arr) {
                var prototype = Object.getPrototypeOf(this);
                prototype.construcor.objects = arr;
            }
        },
        unused: {
            get: function() {
                var prototype = Object.getPrototypeOf(this);
                return prototype.constructor.unused;
            }, set: function(arr) {
                var prototype = Object.getPrototypeOf(this);
                prototype.construcor.unused = arr;
            }
        },
        destroy: function() {
            var prototype = Object.getPrototypeOf(this);
            console.log(prototype.constructor);
            this.unused.push(this);
//            var prototype = Object.getPrototypeOf(this);
//            prototype.constructor.unused.push(this);
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
                if (myc[i].intersect(opc[j])) {
                    callback.apply(this, [myc[i], opc[j]]);
                    break;
                }
            }
        }
    };

    collectiveProto.addTo = function(scene) {
        var i, l;
        var c = this.collection;
        for (i = 0; l = c.length, i < l; i++) {
            scene.addChild(c[i]);
        }
    };

    collectiveProto.intersectFilter = function(func) {

    }

    collectiveProto.intersectTapple = function(func) {

    }

    collectiveProto.alloc = function(num) {
        var constructor = this.constructor;
        constructor.objects = constructor.objects || [];
        constructor.unused = constructor.unused || [];

        for (var i = 0; i < num; i++) {
            var obj = new this();
            constructor.objects.push(obj);
            constructor.unused.push(obj);
        }
    };

    collectiveProto.reuse = function(obj) {
        var constructor = this.constructor;
        constructor.unused.push(obj);
    }

    collectiveProto.getInstance = function() {
        var constructor = this.constructor;
        if(constructor.unused.length == 0){
            this.alloc(256);
        }
        return constructor.unused.pop();
    };

    collectiveProto.log = function() {
        var c = this.constructor;
        return ['objects:', c.objects.length, 'used:', (c.objects.length - c.unused.length), 'unused:', c.unused.length].join(' ');
    };


    Tama = enchant.Class.create(enchant.CollectiveSprite, {
        initialize: function() {
            console.log('sprite initialize');

            enchant.CollectiveSprite.call(this, 32, 32);
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
                    Tama.reuse(this);
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
        Tama.alloc(1024);

        game.rootScene.addEventListener('enterframe', function(evt) {
            if(game.rootScene.age % 10 == 0){
                var num = 60;
                var rad_span = Math.PI * 2 / num;
                var rad_offset = rad_span / 11 * (game.rootScene.age % 11);
                for(var i = 0; i < num; i++){
                    var tama = Tama.getInstance();
                    var rad = rad_span * i + rad_offset;
                    tama.vx = Math.sin(rad);
                    tama.vy = Math.cos(rad);
                    tama.moveTo(160, 160);
                    game.rootScene.insertBefore(tama, label);
                }
                var fps = Math.round(10000 / evt.elapsed)/10;
                var log = Tama.log() + [' fps:', fps].join(' ');
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

