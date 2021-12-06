class BaseRouter {
    constructor() {
        this.routes = {};
        this.bindPopState = this.popState.bind(this);
        this.bindExecCallbackByPath = this.execCallbackByPath.bind(this);
        this.bindPopState();
        this.init(location.pathname);
    }

    init(path) {
        window.history.replaceState({
            path
        }, null, path);

        this.bindExecCallbackByPath(path);
    }

    go(path) {
        const fn = function () {}
        window.history.pushState({
            path
        }, null, path);

        setTimeout(function () {
            this.bindExecCallbackByPath(path);
        })
    }

    route(path, callback) {
        this.routes[path] = callback || function () {};
    }

    popState() {
        window.addEventListener('popstate', (e) => {
            const path = e.state && e.state.path;
            console.log(`in popstate listener path=${path}`);
            this.bindExecCallbackByPath(path);
        })
    }

    execCallbackByPath(path) {
        const cb = this.routes[path];
        if (cb) {
            cb();
        }
    }
}



const body = document.querySelector('body');

function changeBgColor(color) {
    // body.style.backgroundColor = color;
}

const Router = new BaseRouter();

Router.route('/', function () {
    changeBgColor('white');
})

Router.route('/green', function () {
    changeBgColor('green');
})

Router.route('/gray', function () {
    changeBgColor('gray');
})