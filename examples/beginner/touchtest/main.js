enchant();

window.onload = function(){
    var game = new Core(640, 480);
    game.fps = 15;
    game.preload("chara1.png");
    game.onload = function(){
        var label = new Label('');
        var red = new Sprite(120, 120);
        red.backgroundColor = 'red';
        red.moveTo(60, 60);
        game.rootScene.addChild(red);
        

        var blue = new Sprite(120, 120);
        blue.backgroundColor = 'blue';
        game.rootScene.addChild(blue);
        
        blue.on('touchstart', function(evt){
            label.text += 'blue touchstart <br/>';
            red.dispatchEvent(evt);
        });
        
        red.on('touchstart', function(evt){
            label.text += 'red touchstart <br/>';
        });

        game.rootScene.addChild(label);
        

    };
    game.start();
};