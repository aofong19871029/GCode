### 事件冒泡与捕获

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, inital-scale=1.0">
        <title>事件冒泡与捕获</title>
        <style>
            .outer {
                padding: 20px;
                background-color: 'orange';
            }
            .middle{
                padding: 20px;
                background-color: 'steelblue';
                z-index: 1000;
            }
            .inner{
                padding: 20px;
                background-color: 'pink';
            }
        </style>
    </head>
    <body>
        <div class="outer">
            <div class="middle">
                <div class="inner">
                    <butto>click me!</butto>
                </div>
            </div>
        </div>

        <script type="module">
            console.log('%c code is running...', 'color: red');

            // -------------- utils start --------------
            const $ = selector => document.querySelector(selector);
            // -------------- utils end   --------------

            $('.outer').addEventListener('click', function(e){
                console.log('%c [target]', e.target)
                console.log('%c [target]', e.currentTarget)
                console.log('%c [bundle] outer is clicked', 'color: orange')
            }, false)

            $('.middle').addEventListener('click', function(e){
                console.log('%c [target]', e.target)
                console.log('%c [target]', e.currentTarget)
                console.log('%c [bundle] outer is clicked', 'color: steelblue')
            }, false)

            $('.inner').addEventListener('click', function(e){
                console.log('%c [target]', e.target)
                console.log('%c [target]', e.currentTarget)
                console.log('%c [bundle] inner is clicked', 'color: pink')
            }, false)

            $('button').addEventListener('click', function(e){
                console.log('%c [target]', e.target)
                console.log('%c [target]', e.currentTarget)
                console.log('%c [bundle] outer is clicked', 'color: orange')
            }, false)

            // 什么是捕获
            $('.outer').addEventListener('click', function(){
                console.log('%c [capture] outer is clicked', 'color: orange')
            }, true)

            $('.middle').addEventListener('click', function(){
                console.log('%c [capture] outer is clicked', 'color: steelblue')
            }, true)

            $('.inner').addEventListener('click', function(){
                console.log('%c [capture] inner is clicked', 'color: pink')
            }, true)

            $('button').addEventListener('click', function(){
                console.log('%c [capture] outer is clicked', 'color: orange')
            }, true);

            // 冒泡与捕获同时存在， 前执行冒泡 还是先执行捕获
            // 现代浏览器是先捕获 后冒泡
            // 老浏览器 是代码中谁先写谁先执行

            // 阻止冒泡
            // if(target === currentTarget) e.stopPropagation()
            // 
        </script>
    </body>
</html>
```

