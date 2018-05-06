function n(t) {
    return t && t.__esModule ? t : {
        default: t
    }
}
function a() {
    debugger
    if (o) {
        o = !1;
        var t = document.getElementById("GameCanvas")
            , e = document.getElementById("share")
            , i = document.getElementById("Cocos2dGameContainer");
        e || ((e = document.createElement("img")).id = "share",
            e.style.width = "100%",
            e.style.height = "100%",
            e.style.display = "none",
            e.style.position = "absolute",
            e.style.zIndex = "10",
            i.appendChild(e));


        (function (canvas) {
            var context = canvas.getContext('2d')
            context.font="bold 20px Arial";
            context.fillStyle="#058";
            context.fillText("母亲节快乐",40,100);
        })(t);

        var n = t.toDataURL("image/png");
        n.length < 100 || (e.src = n,
            e.style.height = i.style.height,
            e.style.width = i.style.width,
            e.style.padding = i.style.padding,
            e.style.margin = i.style.margin,
            t.style.display = "none",
            e.style.display = "flex")
    }
}
cc._RF.push(e, "a76adQIWF1DVapQzBNv1mU9", "share");
var c = n(t("var"))
    , s = n(t("util"))
    , o = !0;
cc.Class({
    extends: cc.Component,
    properties: {
        panel: cc.Node,
        share_panel: cc.Node,
        share_btn: cc.Node,
        qr_img: cc.Node,
        delay: 0,
        main: cc.Node,
        error: cc.Node
    },
    init: function(t) {
        var e = this;
        this.main = t,
            this.share_panel = cc.find("Canvas/SHARE_PANEL"),
            this.panel = cc.find("Canvas/PANEL"),
            this.share_btn = cc.find("Canvas/SHARE"),
            this.qr_img = cc.find("Canvas/SHARE_PANEL/wechat/qr").getComponent(cc.Sprite),
            this.error = cc.find("Canvas/DEBUG/ERROR").getComponent(cc.Label),
            this.share_btn.active = !1,
            this.stage = cc.find("Canvas/STAGE"),
            this.share_btn.on("touchstart", function(t) {}, this),
            this.share_btn.on("touchend", function(t) {
                e.main.is_freeze = !0,
                    e.clearRemoveTag(),
                    e.fadeLogo().scaleStage().showSharePanel().showQR().showShare().showHint2().showLogoClickHint();
                try {
                    e.createQR(s.default.getNormalizedURL() + "&CKTAG=mta_share.share_qrcode")
                } catch (t) {
                    console.log(t),
                        MtaH5.clickStat("error", {
                            detail1: t.message || t,
                            ua: navigator.userAgent
                        })
                }
                window.MtaH5 && (MtaH5.clickStat("create", {
                    qudao: s.default.getParameterByName("ADTAG"),
                    kol: s.default.getParameterByName("k")
                }),
                    MtaH5.clickStat("fangwen", {
                        create: "true"
                    }),
                    MtaH5.clickShare("share_qrcode"))
            }, this),
            this.setupWeixin()
    },
    setupWeixin: function() {
        window.wx && s.default.isWeixinBrowser && axios.post("http://wx.playstacking.com/wx/sign", {
            url: location.href.split("#")[0]
        }).then(function(t) {
            var e = t.data;
            wx.config({
                debug: !1,
                appId: e.appId,
                timestamp: e.timestamp,
                nonceStr: e.nonceStr,
                signature: e.signature,
                jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
            });
            var i, n, a, c = document.getElementById("share_icon_1"), o = document.getElementById("share_icon_2");
            e.share ? (i = e.share.title,
                n = e.share.desc,
                a = 1 == e.share.img_type ? c.src : o.src) : (i = "汪～你有一张全家福待领取",
                n = "不用美颜、滤镜、磨皮的全家福隆重登场",
                a = c.src),
                wx.ready(function() {
                    wx.onMenuShareTimeline({
                        title: i,
                        desc: n,
                        link: s.default.getNormalizedURL() + "&CKTAG=mta_share.share_timeline",
                        imgUrl: a,
                        success: function() {
                            MtaH5.clickStat("share_timeline", {
                                qudao: s.default.getParameterByName("ADTAG"),
                                kol: s.default.getParameterByName("k")
                            }),
                                MtaH5.clickStat("fangwen", {
                                    share: "true"
                                }),
                                MtaH5.clickShare("share_timeline")
                        }
                    }),
                        wx.onMenuShareAppMessage({
                            title: i,
                            desc: n,
                            link: s.default.getNormalizedURL() + "&CKTAG=mta_share.share_friend",
                            imgUrl: a,
                            success: function() {
                                MtaH5.clickStat("share_friend", {
                                    qudao: s.default.getParameterByName("ADTAG"),
                                    kol: s.default.getParameterByName("k")
                                }),
                                    MtaH5.clickStat("fangwen", {
                                        share: "true"
                                    }),
                                    MtaH5.clickShare("share_friend")
                            }
                        })
                }),
                wx.error(function(t) {
                    console.log(t)
                })
        })
    },
    clearRemoveTag: function() {
        null != this.main.selected_instance && this.main.selected_instance.HideFrame()
    },
    showLight: function() {
        var t = cc.find("Canvas/Light");
        return t.opacity = 0,
            t.runAction(cc.sequence(cc.delayTime(this.delay), cc.fadeIn(.1), cc.fadeOut(.15), cc.fadeIn(.15), cc.fadeOut(.15))),
            this.delay += .8,
            this
    },
    fadeLogo: function() {
        var t = cc.find("Canvas/SHARE_PANEL/Background/logo");
        return this.main.is_mini ? (t.runAction(cc.sequence(cc.delayTime(this.delay), cc.spawn(cc.fadeOut(.2), cc.moveTo(.2, cc.v2(0, 30))))),
            this.delay += .35) : t.active = !1,
            this
    },
    showShare: function() {
        return this.share_panel.runAction(cc.sequence(cc.delayTime(this.delay), cc.callFunc(this.showImage, this))),
            this.delay += .3,
            this
    },
    scaleStage: function() {
        return this.stage.runAction(cc.sequence(cc.delayTime(this.delay), cc.scaleTo(.3, .96))),
            this.delay += .3,
            this
    },
    showSharePanel: function() {
        this.panel.active = !1,
            this.share_panel.active = !0,
            this.share_btn.active = !1;
        var t = this.share_panel.getChildByName("wechat")
            , e = t.getChildByName("web");
        if (c.default.screen_ratio >= c.default.RATIO_THIN_SMALL) {
            var i = t.getChildByName("qr");
            i.scale = .75,
                i.getComponent(cc.Widget).left = 85,
                i.getComponent(cc.Widget).updateAlignment(),
                e.scale = .6,
                e.getComponent(cc.Widget).left = 275,
                e.getComponent(cc.Widget).updateAlignment();
            var n = t.getChildByName("logo");
            n.scale = .6,
                n.getComponent(cc.Widget).right = 80,
                n.getComponent(cc.Widget).updateAlignment();
            var a = t.getChildByName("click_hint");
            a.scale = .85,
                a.getComponent(cc.Widget).right = 88,
                a.getComponent(cc.Widget).updateAlignment()
        }
        return t.opacity = 0,
            this
    },
    showQR: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : .5
            , e = this.share_panel.getChildByName("wechat");
        return e.opacity = 0,
            e.runAction(cc.sequence(cc.delayTime(this.delay), cc.fadeIn(t))),
            this.delay += t + .1,
            this
    },
    showImage: function() {
        o = !0,
            cc.director.once(cc.Director.EVENT_AFTER_DRAW, a)
    },
    showHint2: function() {
        var t = document.getElementById("web_hint_bot")
            , e = document.getElementById("press_save")
            , i = document.getElementById("snap_save")
            , n = cc.view.getVisibleSize().height
            , a = window.innerHeight / n * 350;
        t.style.display = "flex",
            t.style.height = a + "px",
            t.style.transform = "translate3d(0, " + (a + 5) + "px, 0)";
        var c = s.default.iOSVersion();
        return c && c < 10 ? e.style.display = "none" : s.default.isWeixinBrowser ? i.style.display = "none" : e.style.display = "none",
            t.addEventListener("click", function() {
                t.style.transform = "translate3d(0, " + (a + 5) + "px, 0)"
            }, !1),
            setTimeout(function() {
                t.style.transform = "translate3d(0, 0, 0)",
                    setTimeout(function() {
                        t.style.transform = "translate3d(0, " + (a + 5) + "px, 0)"
                    }, 2500)
            }, 1e3 * (this.delay + 1)),
            this.delay += 3,
            this
    },
    showHint: function() {
        var t = this
            , e = document.getElementById("hint_img")
            , i = document.getElementById("hint");
        i || (i = this.createHintDiv()),
        e || (e = this.createHintImg(),
            i.appendChild(e));
        var n = s.default.iOSVersion();
        return n && n < 10 ? this.setImg(e, "hint_capture") : s.default.isWeixinBrowser ? this.setImg(e, "save_hint") : this.setImg(e, "hint_capture"),
            setTimeout(function() {
                t.showHintDiv(i)
            }, 1e3 * (this.delay + 1)),
            this.delay += 3,
            this
    },
    createHintImg: function() {
        var t = document.createElement("img");
        return t.id = "hint_img",
            t.style.width = "300px",
            t
    },
    setImg: function(t, e) {
        t.src = document.getElementById(e).src
    },
    createHintDiv: function() {
        var t = document.createElement("div");
        return t.id = "hint",
            t.style.display = "none",
            t.style.width = "100%",
            t.style.height = "100%",
            t.style.position = "absolute",
            t.style.top = "0",
            t.style.left = "0",
            t.style.zIndex = "25",
            t.style.justifyContent = "center",
            t.style.alignItems = "center",
            t.style.opacity = "0",
            t.style.webkitTransition = t.style.transition = "opacity 0.30s",
            document.body.appendChild(t),
            t.addEventListener("touchstart", function() {
                t.style.opacity = 0,
                    setTimeout(function() {
                        t.style.display = "none"
                    }, 300)
            }),
            t
    },
    showHintDiv: function(t) {
        t.style.display = "flex",
            t.style.opacity = 0,
            setTimeout(function() {
                t.style.opacity = 1,
                    setTimeout(function() {
                        t.style.opacity = 0,
                            setTimeout(function() {
                                t.style.display = "none"
                            }, 300)
                    }, 2300)
            }, 50)
    },
    showLogoClickHint: function() {
        var t = this
            , e = s.default.isWeixinBrowser ? .5 : 2.5;
        return setTimeout(function() {
            t.createClickHint()
        }, 1e3 * (this.delay + e)),
            this
    },
    createClickHint: function() {
        var t = this.share_panel.getChildByName("wechat").getChildByName("click_hint")
            , e = cc.view.getScaleX()
            , i = t.getComponent(cc.Widget).right
            , n = document.createElement("div");
        n.style.width = " 80px",
            n.style.height = " 100px",
            n.style.position = "absolute",
            n.style.bottom = "22px",
            n.style.right = i * e - 40 + "px",
            n.style.zIndex = " 55",
            n.style.webkitTransition = n.style.transition = "opacity 0.25s",
            n.style.textAlign = "center",
            n.style.opacity = "1",
            document.body.appendChild(n),
            n.addEventListener("click", function() {
                MtaH5.clickStat("fangwen", {
                    gotomain: "true"
                }),
                    s.default.isWeixinBrowser ? (MtaH5.clickStat("goto_weixin", {
                        qudao: s.default.getParameterByName("ADTAG"),
                        kol: s.default.getParameterByName("k")
                    }),
                        setTimeout(function() {
                            window.open("https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUxNTM0MzU2Mw==&scene=124#wechat_redirect")
                        }, 30)) : (MtaH5.clickStat("goto_weibo", {
                        qudao: s.default.getParameterByName("ADTAG"),
                        kol: s.default.getParameterByName("k")
                    }),
                        setTimeout(function() {
                            window.open("https://weibo.com/pupupula")
                        }, 30))
            })
    },
    createAnimation: function() {
        var t = document.createElement("style");
        t.type = "text/css";
        t.innerHTML = "      @keyframes fading {          0% {opacity 0;} 50% {opacity:80} 100% {opacity: 0;}      }      @-webkit-keyframes fading {          0% {opacity 0;} 50% {opacity:80} 100% {opacity: 0;}      }      @-moz-keyframes fading {          0% {opacity 0;} 50% {opacity:80} 100% {opacity: 0;}      }    ",
            document.getElementsByTagName("head")[0].appendChild(t)
    },
    createQR: function(t) {
        var e = this
            , i = document.createElement("div");
        i.id = "qrcode",
            i.style.display = "none",
            document.body.appendChild(i);
        new QRCode(i,{
            text: t,
            width: 200,
            height: 200,
            colorDark: "#222222",
            colorLight: "#F6F6F6",
            correctLevel: QRCode.CorrectLevel.M
        });
        var n = i.getElementsByTagName("img")[0];
        setTimeout(function() {
            var t = new cc.Texture2D;
            t.initWithElement(n),
                t.handleLoadedTexture();
            var i = new cc.SpriteFrame(t);
            e.qr_img.spriteFrame = i
        }, 200)
    }
}),
    cc._RF.pop()
}