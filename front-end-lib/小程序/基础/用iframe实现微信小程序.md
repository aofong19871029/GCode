

我们知道，在微信小程序中，渲染线程与js线程是分开。那么我们可以用iframe来模拟。

在这之前我们需要先启动服务

首先我们需要先启动一个服务

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const fs = require('fs');

const port = process.env.PORT || 8089;

const app = new Koa();
const router = new Router();
router.get('/app.json', async(ctx) => {
    ctx.type = 'application/json';
    ctx.body = fs.createReadStream('./public/app.json');
});
router.get('/test', async(ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream('./public/containter.html');
});

app.use(router.routes());
app.use(serve(__dirname+ '/public'));
app.listen(port, () => {
    console.log(`node listen on ${port}`);
});
```



我们定义一个根html叫做：containter.html。这个文件相当于微信小程序的架构。在这个之内我们创建一个iframe，ID为jsCoreIframe。这个iframe就相当于小程序的js线程。

接下来我们在跟html下创建一个loadPage的方法，那么一般在我们跳转页面的时候，微信会根据app.json中的pages字段判断跳转的页面是否在pages中有定义。因此我们首先需要一个类似于app.json的功能

```javascript
// client端
 let appConfig = {};
function getAppJson() {
  fetch('http://localhost:8089/app.json')
    .then((res) => {
    return res.json();
  }).then((config) => {
    appConfig = config || {};
  });
};
// node端
router.get('/app.json', async(ctx) => {
    ctx.type = 'application/json';
    ctx.body = fs.createReadStream('./public/app.json');
});
```

在获取完成json之后，我们就可以去通过loadPage去获取首页或者是跳转至其他页面。我们可以想一下，渲染线程跟js线程之间是互相隔离的，那么该通过什么让他们之间进行关联呢？

没错，我们可以通过页面的ID关联，我们肯定是要先加载页面，完成之后再去加载对应的js。如果不这么做的话，你JS加载完成了，页面尚未加载，那么就不会对页面发起解析。

那么我们就可以创建一个iframeId，用这个iframeId做映射。

```javascript
function loadPage(url, successcb, failcb) {
  const iframeId = new Date().getTime();
  if (!appConfig || !appConfig.pages) {
    failcb('初始化项目失败');
    return;
  }
  const index = appConfig.pages.indexOf(url);
  if (index === -1) {
    failcb('你所访问的页面未定义');
    return;
  }
  const p = new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.id = iframeId;
    iframe.onload = () => {
      resolve();
    };
    document.body.appendChild(iframe);
  });
  p.then(() => {
    successcb(iframeId);
  });
  p.catch((e) => {
    console.log('e', e);
  });
}
```

那么在创建app完成之后呢，我们就需要去加载页面的JS。所以我们要去掉JSCore中的方法。我们在这一块JScore是我们的一个ifame，iframe中只有js代码，没有页面代码。因此我们需要在Jscore中定义一个去加载js的代码。并且需要与我们上一步的iframeId进行关联，我们在这里用map进行关联。并且在渲染线程中调用它

```javascript
var scriptMap = new Map();
console.log(app);
function loadScript(url, iframeId) {
console.log('加载app', iframeId);
window.iframeId = iframeId.toString();
const script = document.createElement('script');
script.src = url;
script.onload = (e) => {
scriptMap.get(window.iframeId).resertPage();

};
document.body.appendChild(script);
}
```

```javascript
const successCb = (id) => {
    console.log(document.getElementById('jsCoreIframe').contentWindow);
                												document.getElementById('jsCoreIframe').contentWindow.loadScript('./page1.js', id);
 };
   loadPage('./page1.html', successCb, (str) => { alert(str)});
```

这样我们就完成了加载页面->页面展示->js线程加载对应的代码。

接下来我们需要去实现一方法对页面中的数据进行解析，包括但不限于点击事件等，还有将模板替换成真是的数据。

```javascript
// 解析html
changeInnerHtml: (iframe, resertHtml) => {
        let tempStr = ''
        let findKey = '';
        for (let i = 0; i < resertHtml.length; i++) {
            if (resertHtml[i] === '#') {
                let z = i + 1;
                while (z < resertHtml.length) {
                    if (resertHtml[z] != '#') {
                        findKey += resertHtml[z];
                        z += 1;
                        continue;
                    }
                    tempStr += page1Data[findKey];
                    i = z + 1;
                    break;
                }
            }
            tempStr += resertHtml[i];
        }
        iframe.document.body.innerHTML = tempStr;
    },
```

接下来是对点击事件等的解析

```javascript
const changeFun = (children) => {
            for (let i = 0; i < children.length; i++) {
                const tapEvent = children[i].getAttribute('tap');
                children[i].removeAttribute('tap');
                if(page1Data[tapEvent]) {
                    let temp = `'${tapEvent}'`
                    console.log(scriptMap);
                    const content = `(id, tapEvent) => {
                        console.log(tapEvent);
                        // console.log(parent.document.getElementById('jsCoreIframe'));
                        const content = 											parent.document.getElementById('jsCoreIframe').contentWindow;
                        console.log(content, id);
                        console.log(typeof id);
                        const info = content.scriptMap.get(String(id));
                        console.log(content.scriptMap);
                        console.log(info);
                        info[tapEvent]();
                        // console.log(content.scriptMap);
                    }`
                    // console.log(content);
                    children[i].setAttribute('onClick', `(${content})(${bindIframeId}, ${temp})`);
                }
            }
        };
```

完成这两个解析之后，我们的页面中例如：{info}就会被替换成真是info对应的数据。

并且在点击的时候，我们也能触发相应的函数。