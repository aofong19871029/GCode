/**
 * auth:tczhu
 * breif:观察者类，监听、发布
 * @module cwx/observers
*/
var Observer = (function(){
  var addObserverForKey = function(key,noti){
    /** 将回调追加到观察者列表中 */
    var observers = this[key]
    if(!observers){
      this[key] = [];
      observers = this[key];
    }
    observers.push(noti);
  }

  /** 通知Key回调 */
    var noti = function(key,value){
      var observers = this[key]
      if(!observers){
        return;
      }
      observers.map(function(observer){
        /** 如果是function */
        if(typeof observer == "function"){
          observer(value)
        }else if(typeof observer == "object"){
          /** 如果是对象的话需要实现 observerNoti*/
          if(observer.observerNoti){
            observer.observerNoti(this,key,value);
          }
        }
      },this)
    }

    var removeObserverForKey = function(key,observer){
        var observers = this[key]
        if(!observers){
          return;
        }
        var index = observers.indexOf(observer)
        if(index != -1){
          /** 如果存在，移除钙元素 */
          observers.splice(index,1)
        }
    }

  var removeAllObserversForKey = function (key, observer) {
    var observers = this[key]
    if (!observers) {
      return;
    }
    this[key] = [];
  }


    var Observer = {
      addObserverForKey: addObserverForKey,
      noti: noti,
      removeObserverForKey: removeObserverForKey,
      removeAllObserversForKey: removeAllObserversForKey
    }

    return Observer;

})()

module.exports = Observer;