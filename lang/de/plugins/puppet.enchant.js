/**
 * Puppet.enchant.js
 * @version 0.2 (2012/11/8)
 * @requires enchant.js v0.4.0 or later
 *
 * @description
 * Puppet classes for enchant.js
 */

var theatre, game;

var rand = function(n) {
    return Math.floor(Math.random() * n);
};

(function() {

    var cloneObject = function(obj, deep) {
        deep = !!deep;
        var ret = {};
        var elem;
        for (var prop in obj) {
            elem = obj[prop];
            if (obj.hasOwnProperty(prop)) {
                if (deep) {
                    if (elem instanceof Array) {
                        ret[prop] = elem.slice();
                    } else if (typeof elem === 'object') {
                        ret[prop] = cloneObject(elem, deep);
                    }
                } else {
                    ret[prop] = elem;
                }
            }
        }
        return ret;
    };

    enchant.puppet = {
        assets: [
            'space3.png', 'icon0.png', 'chara0.png', 'chara1.png',
            'chara2.png', 'chara3.png', 'chara3.png', 'chara4.png',
            'chara5.png', 'chara6.png', 'chara7.png', 'starship.png',
            'enemy01.png', 'effect0.gif', 'eclipse.png', 'hollywood.png',
            'desert.png', 'beach.png', 'sky.png', 'spacebg.png'
        ]
    };

    enchant.puppet.Puppet = enchant.Class.create(enchant.Sprite, {
        initialize: function(_x, _y) {
            var theatre = enchant.puppet.Theatre.instance;
            var w = (typeof this.w === 'number') ? this.w : 32;
            var h = (typeof this.h === 'number') ? this.h : 32;
            var path = this.filename ? this.filename : 'chara1.png';
            enchant.puppet.Puppet.instances.push(this);
            enchant.Sprite.call(this, w, h);
            this.image = theatre.assets[path];
            this.x = _x;
            this.y = _y;
            this.HP = 100;
            this.isHit = false;
            this.frame = this.f ? this.f : 0;
            this.init();
            theatre.stage.addChild(this);
            this.parentScene = theatre.stage;
            this.addEventListener('enterframe', this._displayCheck);
            this.addEventListener('enterframe', this._collisionCheck);
            this.addEventListener('enterframe', this._invokeBehavior);
            this.addEventListener('touchstart', this._invokeBehavior);
            this.addEventListener('touchmove', this._invokeBehavior);
            this.addEventListener('touchend', this._invokeBehavior);
            this.addEventListener('hit', this._invokeBehavior);
        },
        init: function() {
        },
        show: function() {
            this.parentScene.addChild(this);
        },
        hide: function() {
            this.parentScene.removeChild(this);
        },
        _collisionCheck: function() {
            if (!this.isHit && this.collision) {
                var e = new enchant.Event('hit');
                for (var i in this.collision) {
                    var puppets = window[this.collision[i]].instances;
                    for (var j in puppets) {
                        if (this !== puppets[j] && this.intersect(puppets[j])) {
                            e.another = puppets[j];
                            this.dispatchEvent(e);
                        }
                    }
                }
            }
        },
        _displayCheck: function() {
            if (this.x < -320 || this.x > 640 ||
                this.y < -320 || this.y > 640) {
                this.die();
            }
        },
        _invokeBehavior: function(e) {
            var type = e.type;
            var listeners = this['_' + type];
            if (listeners) {
                for (var i = 0, l = listeners.length; i < l; i++) {
                    listeners[i].func.call(this, e);
                }
            }
            if (this[type]) {
                this[type].call(this);
            }
        },
        die: function() {
            this.hide();
            var puppets = window[this.puppetName].instances;
            for (var i in puppets) {
                if (this === puppets[i]) {
                    puppets.splice(i, 1);
                }
            }
        },
        addBehavior: function(behaviorName) {
            var behaviors = [];
            behaviors[0] = behaviorName;
            if (behaviors[0] instanceof Array) {
                behaviors = behaviorName;
            }
            for (var j in behaviors) {
                var behavior = enchant.puppet.Puppet.behaviors[behaviors[j]];
                for (var k in behavior) {
                    if (!this['_' + k]) {
                        this['_' + k] = [];
                    }
                    this['_' + k].push({
                        func: behavior[k],
                        behaviorName: behaviors[j]
                    });
                }
            }
            for (var i in this['_init']) {
                this['_init'][i].func.call(this);
            }

        },
        '開始': function(behaviorName) {
            this.addBehavior(behaviorName);
        },
        start: function(behaviorName) {
            this.addBehavior(behaviorName);
        },
        removeBehavior: function(behaviorName) {
            var behavior = enchant.puppet.Puppet.behaviors[behaviorName];
            for (var i in behavior) {
                var eventName = i;
                if (this['_' + eventName]) {
                    var eventArray = this['_' + eventName];
                    for (var j in eventArray) {
                        if (eventArray[j].behaviorName === behaviorName) {
                            this['_' + eventName].splice(j, 1);
                            break;
                        }
                    }
                }
            }
        },
        'やめる': function(behaviorName) {
            this.removeBehavior(behaviorName);
        },
        stop: function(behaviorName) {
            this.removeBehavior(behaviorName);
        }
    });
    enchant.puppet.Puppet.instances = [];
    enchant.puppet.Puppet.constructors = [];

    enchant.puppet.Puppet.sceneTouchendEventListener = [];
    enchant.puppet.Puppet.sceneEnterframeEventListener = [];
    enchant.puppet.Puppet.sceneStartEventListener = [];

    enchant.puppet.Puppet.create = function(puppetName, option) {
        var definition = {
            initialize: function(x, y) {
                enchant.puppet.Puppet.call(this, x, y);
                window[puppetName].instances.push(this);
                if (this.__enterframe) {
                    this._enterframe = this.__enterframe.slice(0);
                }
                if (this.__touchend) {
                    this._touchend = this.__touchend.slice(0);
                }
                if (this.__touchstart) {
                    this._touchstart = this.__touchstart.slice(0);
                }
                if (this.__touchmove) {
                    this._touchmove = this.__touchmove.slice(0);
                }
                if (this.__hit) {
                    this._hit = this.__hit.slice(0);
                }
                var listeners = this.__init;
                if (listeners) {
                    for (var i in listeners) {
                        listeners[i].func.call(this);
                    }
                }
            },
            speed: 10,
            interval: 30,
            appearInterval: 30,
            initialNumber: 10
        };

        for (var i in option) {
            if (i === 'behavior' || i === 'ビヘイビア') {
                var behaviors = [];
                behaviors[0] = option[i];
                if (option[i] instanceof Array) {
                    behaviors = option[i];
                }
                for (var j in behaviors) {
                    var behavior;
                    if (typeof behaviors[j] === 'string') {
                        behavior = enchant.puppet.Puppet.behaviors[behaviors[j]];
                    } else {
                        behavior = behaviors[j];
                    }
                    for (var k in behavior) {
                        if (!definition['__' + k]) {
                            definition['__' + k] = [];
                        }
                        definition['__' + k].push({
                            func: behavior[k],
                            behaviorName: behaviors[j]
                        });
                    }
                }
            }
            if (i === 'collision' || i === '当たる相手') {
                if (option[i] instanceof Array) {
                    definition[i] = option[i];
                } else {
                    definition[i] = [ option[i] ];
                }
            } else {
                definition[i] = option[i];
            }
        }

        var that = this;

        var alias = [
            [ 'speed', 'スピード' ],
            [ 'startPin', 'スタート位置' ],
            [ 'w', '幅' ],
            [ 'h', '高さ' ],
            [ 'f', 'フレーム' ],
            [ 'collision', '当たる相手' ],
            [ 'filename', 'ファイル名' ],
            [ 'enterframe', '動き' ],
            [ 'touchend', '触られた時' ],
            [ 'hit', '当たった時' ]
        ];

        for (i in alias) {
            var word = alias[i];
            if (definition[word[1]]) {
                definition[word[0]] = definition[word[1]];
            }
        }

        var listeners;
        if (definition.__sceneEnterframe) {
            listeners = definition.__sceneEnterframe;
            for (i in listeners) {
                listeners[i].puppetName = puppetName;
                enchant.puppet.Puppet.sceneEnterframeEventListener.push(listeners[i]);
            }
        }
        if (definition.__sceneStart) {
            listeners = definition.__sceneStart;
            for (i in listeners) {
                listeners[i].puppetName = puppetName;
                enchant.puppet.Puppet.sceneStartEventListener.push(listeners[i]);
            }
        }
        if (definition.__sceneTouchend) {
            listeners = definition.__sceneTouchend;
            for (i in listeners) {
                listeners[i].puppetName = puppetName;
                enchant.puppet.Puppet.sceneTouchendEventListener.push(listeners[i]);
            }
        }
        definition.puppetName = puppetName;

        var definitionSet = cloneObject(definition);

        var newPuppet = enchant.Class.create(this, definition);

        enchant.puppet.Puppet.constructors.push(newPuppet);
        window[puppetName] = newPuppet;
        window[puppetName].instances = [];
        window[puppetName].definition = definitionSet;
        return newPuppet;
    };

    enchant.puppet.Puppet.clear = function() {
        enchant.puppet.Puppet.sceneTouchendEventListener = [];
        enchant.puppet.Puppet.sceneEnterframeEventListener = [];
        enchant.puppet.Puppet.sceneStartEventListener = [];
        var puppet;
        for (var i in enchant.puppet.Puppet.instances) {
            puppet = enchant.puppet.Puppet.instances[i];
            puppet.die();
        }
    };

    enchant.puppet.Puppet.behaviors = {
        moveLeft: {
            enterframe: function() {
                this.x -= this.speed * 0.1;
            }
        },
        die: {
            enterframe: function() {
                this.die();
            }
        },
        bigger: {
            enterframe: function() {
                this.scaleX *= 1.05;
                this.scaleY *= 1.05;
            }
        },
        smaller: {
            enterframe: function() {
                this.scaleX *= 0.95;
                this.scaleY *= 0.95;
            }
        },
        moveRight: {
            enterframe: function() {
                this.x += this.speed * 0.1;
            }
        },
        moveUp: {
            enterframe: function() {
                this.y -= this.speed * 0.1;
            }
        },
        moveDown: {
            enterframe: function() {
                this.y += this.speed * 0.1;
            }
        },
        moveRandomDir: {
            init: function() {
                this.vx = rand(this.speed) - this.speed / 2;
                this.vy = rand(this.speed) - this.speed / 2;
            },
            enterframe: function() {
                this.x += this.vx;
                this.y += this.vy;
            }
        },
        randomAppearLeft: {
            sceneEnterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                if (theatre.frame % this.interval === 0) {
                    var item = new window[this.puppetName](-30 - rand(160), rand(320));
                }
            },
            enterframe: function() {
                this.x += this.speed * 0.1;
            }
        },
        randomAppearRight: {
            sceneEnterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                if (theatre.frame % this.interval === 0) {
                    var item = new window[this.puppetName](320 + rand(160), rand(320));
                }
            },
            enterframe: function() {
                this.x -= this.speed * 0.1;
            }
        },
        randomAppearTop: {
            sceneEnterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                if (theatre.frame % this.interval === 0) {
                    var item = new window[this.puppetName](rand(320), -60 - rand(160));
                }
            },
            enterframe: function() {
                this.y += this.speed * 0.1;
            }

        },
        randomAppearBottom: {
            sceneEnterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                if (theatre.frame % this.interval === 0) {
                    var item = new window[this.puppetName](rand(320), 320 + rand(160));
                }
            },
            enterframe: function() {
                this.y -= this.speed * 0.1;
            }
        },
        randomSetup: {
            sceneStart: function() {
                for (var i = 0, l = this.initialNumber; i < l; i++) {
                    var item = new window[this.puppetName](rand(320), rand(320));
                }
            }
        },
        standAlone: {
            sceneStart: function() {
                var theatre = enchant.puppet.Theatre.instance;

                var startPins = [];
                if (!this.startPin) {
                    startPins = [
                        [ theatre.width / 2, theatre.height / 2 ]
                    ];
                } else {
                    if (this.startPin[0] instanceof Array) {
                        startPins = this.startPin;
                    } else {
                        startPins = [ this.startPin ];
                    }
                }
                for (var i in startPins) {
                    var startPin = startPins[i];
                    var startX = this.startPin ? startPin[0] : theatre.width / 2;
                    var startY = this.startPin ? startPin[1] : theatre.height / 2;
                    var item = new window[this.puppetName](startX, startY);
                }
            }
        },
        zigzagX: {
            enterframe: function() {
                this.x += Math.cos(this.age * 0.1) * 0.1 * this.speed;
            }
        },
        zigzagY: {
            enterframe: function() {
                this.y += Math.sin(this.age * 0.1) * 0.1 * this.speed;
            }
        },
        tapRC: {
            init: function() {
                this.a = 0;
                this.dir = -Math.PI / 2;
            },
            enterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                this.x += Math.cos(this.dir) * this.speed * 0.1;
                this.y += Math.sin(this.dir) * this.speed * 0.1;
                if (theatre.touchX > 180) {
                    this.dir += 0.1;
                }
                if (theatre.touchX < 140) {
                    this.dir -= 0.1;
                }
                this.rotation = this.dir * 180 / Math.PI + 90;
            }
        },
        tapMove: {
            enterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                this.x = theatre.touchX;
                this.y = theatre.touchY;
            }
        },
        tapMoveX: {
            enterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                this.x = theatre.touchX;
            }
        },
        tapMoveY: {
            enterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                this.y = theatre.touchY;
            }
        },
        tapChase: {
            enterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                this.x += (theatre.touchX - this.x) * 0.01 * this.speed;
                this.y += (theatre.touchY - this.y) * 0.01 * this.speed;
            }
        },
        tapChaseX: {
            enterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                this.x += (theatre.touchX - this.x) * 0.01 * this.speed;
            }
        },
        tapChaseY: {
            enterframe: function() {
                var theatre = enchant.puppet.Theatre.instance;
                this.y += (theatre.touchY - this.y) * 0.01 * this.speed;
            }
        },
        hitAndDie: {
            hit: function() {
                this.die();
            }
        },
        hitAndScore: {
            hit: function() {
                var theatre = enchant.puppet.Theatre.instance;
                theatre.score++;
            }
        },
        hitOnce: {
            hit: function() {
                this.isHit = true;
            }
        },
        randomAge: {
            init: function() {
                this.age = rand(this.speed + 10);
            }
        }
    };

    enchant.puppet.ColorScreen = enchant.Class.create(enchant.Sprite, {
        initialize: function(start, end) {
            var theatre = enchant.puppet.Theatre.instance;
            enchant.Sprite.call(this, theatre.width, theatre.height);
            this.image = new enchant.Surface(this.width, this.height);
            this.change(start, end);
        },
        change: function(start, end) {
            var ctx = this.image.context;
            var grad = ctx.createLinearGradient(0, 0, 0, this.height);
            grad.addColorStop(0, start);
            grad.addColorStop(1, end);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);
        }
    });

    enchant.puppet.ScoreBoard = enchant.Class.create(enchant.Label, {
        initialize: function() {
            var theatre = enchant.puppet.Theatre.instance;
            enchant.Label.call(this);
            this.prefix = 'SCORE: ';
            this.addEventListener('enterframe', this._update);
        },
        _update: function() {
            var theatre = enchant.puppet.Theatre.instance;
            this.text = this.prefix + theatre.score;
        }
    });

// for nineleap plugins
    var parentModule = null;
    (function() {
        if (enchant.nineleap !== undefined) {
            if (enchant.nineleap.memory !== undefined &&
                Object.getPrototypeOf(enchant.nineleap.memory) === Object.prototype) {
                parentModule = enchant.nineleap.memory;
            } else if (enchant.nineleap !== undefined &&
                Object.getPrototypeOf(enchant.nineleap) === Object.prototype) {
                parentModule = enchant.nineleap;
            }
        } else {
            parentModule = enchant;
        }
    }());

    enchant.puppet.Theatre = enchant.Class.create(parentModule.Game, {
        initialize: function(w, h) {
            parentModule.Game.call(this, w, h);
            enchant.puppet.Theatre.instance = this;
            var topGrad = 'rgb(30, 150, 255)';
            var bottomGrad = 'rgb(255, 255, 255)';
            this.touchX = this.width / 2;
            this.touchY = this.height / 2;
            this.score = 0;
            this.backdrop = new enchant.Group();
            this.rootScene.addChild(this.backdrop);
            this.stage = new enchant.Group();
            this.rootScene.addChild(this.stage);
            this.screen = new enchant.puppet.ColorScreen(topGrad, bottomGrad);
            this.backdrop.addChild(this.screen);
        }
    });
    enchant.puppet.Theatre.instance = null;
// version compatibility
    enchant.puppet.Puppet.Theatre = enchant.puppet.Theatre;

    enchant.puppet.Theatre.create = function(definition) {
        window.onload = function() {
            var w, h, bg;
            if (definition) {
                w = definition.w ? definition.w : 320;
                h = definition.h ? definition.h : 320;
                bg = definition.backdrop;
            }
            theatre = game = new enchant.puppet.Theatre(w, h);

            if (bg) {
                theatre.screen.change(bg.top, bg.bottom);
            }

            var scoreBoard = new enchant.puppet.ScoreBoard('SCORE: 0');
            theatre.rootScene.addChild(scoreBoard);

            theatre.onload = function() {
                var listeners = enchant.puppet.Puppet.sceneStartEventListener;
                for (var i in listeners) {
                    listeners[i].func.call(window[listeners[i].puppetName].definition);
                }

                theatre.rootScene.addEventListener('touchend', function(e) {
                    theatre.touchX = e.x;
                    theatre.touchY = e.y;
                    var listeners = enchant.puppet.Puppet.sceneTouchendEventListener;
                    for (var i in listeners) {
                        var instances = window[listeners[i].puppetName].instances;
                        for (var j in instances) {
                            listeners[i].func.call(instances[j]);
                        }
                    }
                });
                theatre.rootScene.addEventListener('touchstart', function(e) {
                    theatre.touchX = e.x;
                    theatre.touchY = e.y;
                });
                theatre.rootScene.addEventListener('touchmove', function(e) {
                    theatre.touchX = e.x;
                    theatre.touchY = e.y;
                });
                theatre.rootScene.addEventListener('enterframe', function(e) {
                    var listeners = enchant.puppet.Puppet.sceneEnterframeEventListener;
                    for (var i in listeners) {
                        listeners[i].func.call(window[listeners[i].puppetName].definition);
                    }
                });
            };
            theatre.start();
        };
    };

    window['パペット'] = enchant.puppet.Puppet;
    window['パペット作成'] = enchant.puppet.Puppet.create;

    window['ジグザグX'] = 'zigzagX';
    window['ジグザグY'] = 'zigzagY';
    window['上から現れる'] = 'randomAppearTop';
    window['下から現れる'] = 'randomAppearBottom';
    window['右から現れる'] = 'randomAppearRight';
    window['左から現れる'] = 'randomAppearLeft';
    window['右へ動く'] = 'moveRight';
    window['左へ動く'] = 'moveLeft';
    window['上へ動く'] = 'moveUp';
    window['下へ動く'] = 'moveDown';
    window['ランダムな方向へ動く'] = 'moveRandomDir';
    window['タップすると移動'] = 'tapMove';
    window['タップするとX移動'] = 'tapMoveX';
    window['タップするとY移動'] = 'tapMoveY';
    window['タップするとスルスル移動'] = 'tapChase';
    window['タップするとスルスルX移動'] = 'tapChaseX';
    window['タップするとスルスルY移動'] = 'tapChaseY';
    window['ランダムに配置'] = 'randomSetup';
    window['一人で登場'] = 'standAlone';
    window['当たると消える'] = 'hitAndDie';
    window['当たると得点'] = 'hitAndScore';
    window['一回だけ当たる'] = 'hitOnce';

}());
