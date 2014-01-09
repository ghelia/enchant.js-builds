enchant.js
==========

Pre-built files of [wise9/enchant.js](https://github.com/wise9/enchant.js).

<img src="http://github.com/wise9/enchant.js/raw/master/enchant.png" width="320" height="320">

[![Build Status](https://secure.travis-ci.org/wise9/enchant.js.png)](https://travis-ci.org/wise9/enchant.js)

Download
--------
> v0.8.0

- [enchant.js](https://raw.github.com/uei/enchant.js-builds/master/build/enchant.js)
- [enchant.min.js](https://raw.github.com/uei/enchant.js-builds/master/build/enchant.min.js) (compressed)

- [Download Zip](https://github.com/wise9/enchant.js/archive/master.zip)

Documentation
-------------

- English
    - <http://wise9.github.com/enchant.js/doc/core/en/index.html>
    - <http://wise9.github.com/enchant.js/doc/plugins/en/index.html> (with plugins)
- Deutsch (German)
    - <http://wise9.github.com/enchant.js/doc/core/de/index.html>
    - <http://wise9.github.com/enchant.js/doc/plugins/de/index.html> (with plugins)
- Japanese
    - <http://wise9.github.com/enchant.js/doc/core/ja/index.html>
    - <http://wise9.github.com/enchant.js/doc/plugins/ja/index.html> (with plugins)
- See also [enchantjs.com](http://enchantjs.com)

Design
------

- Compact
- Standalone
- Graphics Object Tree
- Event Driven

Platform
--------

- Chrome
- Safari
- Firefox
- IE9
- iOS
- Android 2.1+

License
-------

MIT License

Usage
-----
```html
<script src='./enchant.js'></script>
<script>
    enchant();
    window.onload = function(){
        var game = new Game(320, 320);

        var label = new Label('Hello, enchant.js!');
        game.rootScene.addChild(label);

        game.start();
    }
</script>
```

More examples and references: [enchantjs.com](http://enchantjs.com)

