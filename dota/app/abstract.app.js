define(['dInherit', 'dPageCache', 'dUIView'], function (dInherit, dPageCache, dUIView) {

    var Appliction = dInherit({
        __propertys__: function () {
            //当前视图路径
            this.viewpath;
            //主框架
            this.mainframe;
            //视图框架
            this.viewport;

            //视图集
            this.pageCache = new dPageCache();
            //当前视图
            this.curPage;
            //最后访问视图视图
            this.lastPage;

            //提供给视图访问Appliction的接口
            this.inteface = {
                loadView: _.bind(this.loadView, this),
                forward: _.bind(this.forward, this),
                back: _.bind(this.back, this)
            };
        },

        initialize: function (options) {
            this.setOption(options);

            this.bindEvent();

        },
        setOption: function (options) {
            options = options || {};
            for (var i in options) {
                this[i] = options[i];
            }
        },


        //根据根据id以及页面的类
        //定义view的turing方法，这里不是直接放出去，而是通过app接口放出，并会触发各个阶段的方法
        //注意，这里是传递id，有可能乱跳，
        switchView: function (path) {
            var id = path;
            var curView = this.views.getItem(id);

            //切换前的当前view，马上会隐藏
            var lastView = this.curView;

            //如果当前view存在则触发其onHide事件，做资源清理
            //但是如果当前view就是 马上要访问的view的话，这里就不会触发他的onHide事件
            //所以lastview可能并不存在
            if (lastView && lastView != curView) {
                this.lastView = lastView;
            }

            //如果当前view存在，则执行请onload事件
            if (curView) {

                //如果当前要跳转的view就是当前view的话便不予处理
                if (curView == this.curView && this.isChangeHash == false) {
                    return;
                }

                //因为初始化只会执行一次，所以每次需要重写request
                curView.request = this.request;
                //这里有一个问题，view与view之间并不需要知道上一个view是什么，下一个是什么，这个接口应该在app中
                this.curView = curView;

                var lastViewName = (lastView || curView).viewname;
                this.curView.__load(lastViewName);

            } else {
                //重来没有加载过view的话需要异步加载文件
                //此处快速切换可能导致view文件未加载结束，而已经开始执行其它view的逻辑而没有加入dom结构
                this.loadView(path, function (View) {
                    curView = new View(this.request, this.inteface, id);

                    //保存至队列
                    this.views.push(id, curView);

                    //这个是唯一需要改变的
                    curView.turning = _.bind(function () {
                        this.createViewPort();
                        curView.viewport = this.viewport;
                        //            curView.$el.focus();

                        //动画会触发inView的show outView 的hide
                        this.startAnimation(function (inView, outView) {
                            //防止view显示错误，后面点去掉
                            this.views.each(function (view, path) {
                                if (inView === view || outView === view) return false;
                                view.$el.hide();
                            });

                            //防止白屏
                            inView.$el.show();

                        });

                    }, this);

                    this.curView = curView;
                    var lastViewName = (lastView || curView).viewname;

                    this.curView.__load(lastViewName);

                });
            }
        },

        //动画相关参数，这里要做修改，给一个noAnimat
        startAnimation: function (callback) {
            var inView = this.curView;
            var outView = this.lastView;

            //l_wang在此记录outview的位置，较为靠谱，解决记录位置不靠谱问题
            if (outView) {
                outView.scrollPos = {
                    x: window.scrollX,
                    y: window.scrollY
                };
            }

            //当非app中则不使用动画
            if (!this.animatSwitch) this.isAnimat = false;

            if (!this.isAnimat) this.animatName = this.animNoName;

            this.timeoutres = this.animations[this.animatName] && this.animations[this.animatName].call(this, inView, outView, callback, this);

            //此参数为一次性，调用一次后自动打开动画
            this.isAnimat = true;
        },

        //加载view
        loadView: function (path, callback) {
            var self = this;
            require([this.buildUrl(path)], function (View) {
                callback && callback.call(self, View);
            });
        },

        loadViewFromUrl: function(url){
        },

        //创建dom结构
        createViewPort: function () {
            if (this.isCreate) return;
            var html = [
                '<div class="main-frame">',
                '<div class="main-viewport"></div>',
                '<div class="main-state"></div>',
                '</div>'
            ].join('');
            this.mainframe = $(html);
            this.viewport = this.mainframe.find('.main-viewport');
            this.statedom = this.mainframe.find('.main-state');
            var container = $('#main');
            container.empty();
            container.append(this.mainframe);
            this.isCreate = true;
        },


        forward: function (url, replace, isNotAnimat) {

        },

        back: function (url, isNotAnimat) {

        }

    });
    return Appliction;
});