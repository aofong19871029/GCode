const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaStatic = require('koa-static');
const mockData = require('./mock.js');
const app = new Koa();
const router = new KoaRouter();
const map = {};
router.get('/shopList', (ctx) => {
    ctx.body = mockData;
});
// addShopToCar
router.get('/addShopToCar', (ctx) => {
    const { Id } = ctx.query;
    let nowLen = map[Id] || 0;
    nowLen += 1;
    map[Id] = nowLen;
    ctx.body = 'success'

});
router.get('/shopCarLen', (ctx) => {
    const keys = Object.keys(map);
    let count = 0;
    keys.forEach(item => {
        count += map[item];
    });
    ctx.body = count;
});
router.get('/getShopinfoById', (ctx) => {
    const { id } = ctx.query;
    for (let i = 0; i < mockData.length; i++) {
        if(id == mockData[i].Id) {
            ctx.body = mockData[i];
            return;
        }
    }
    ctx.body = {};
});
router.get('/buyInfo', (ctx) => {
    const keys = Object.keys(map);
    const tempArr = [];
    keys.forEach((item) => {
        for (let i = 0; i < mockData.length; i++) {
            if (mockData[i].Id === item) {
                tempArr.push({
                    count: map[item],
                    info: mockData[i],
                });
                break;
            }
        }
    })
    ctx.body = tempArr;
});
app.use(router.routes());

const staticServer = KoaStatic(`${__dirname}/public`);
app.use(staticServer);

app.listen(8080, () => {
    console.log('开始监听8080');
});

