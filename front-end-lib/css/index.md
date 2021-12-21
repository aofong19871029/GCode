https://blog.csdn.net/qq_36380426/article/details/115388051

#### 清除浮动

1. 额外标签法 
   在最后一个浮动标签后，新家一个标签，给其设置clear:both

2. 父元素overflow:hidden 将父元素变成一个BFC

3. 使用:after  clearboth

4. 使用:before 和 :after双伪元素清除浮动

   ```html
   .clearfix:after,
   .clearfix:before{
     content: "";
     display: table;
   }
   .clearfix:after{clear: both;}
   .clearfix*zoom: 1;    }
   
   <div class="fahter clearfix">
       <div class="big">big</div>
       <div class="small">small</div>
   </div>
   <div class="footer"></div>
   ```

#### 三角形

1. 用border

```css
#triangle-up {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid red;
}
```



1. 用before ,after

   ```css
   .left{
    position: absolute;
   }
   .left:before,.left:after{
    position: absolute;
    content: '';
    border-top: 10px transparent dashed;
    border-left: 10px transparent dashed;
    border-bottom: 10px transparent dashed;
    border-right: 10px #fff solid;
   }
   .left:before{
    border-right: 10px #0099CC solid;
   }
   .left:after{
    left: 1px; /*覆盖并错开1px*/
    border-right: 10px #fff solid;
   }
   ```

#### 椭圆

```css
.oval {
    width: 400px;
    height: 200px;
    border-radius: 50%/50%;
    background-color: red;
}
```

#### css 权重和优先级

*从0开始，一个行内样式+1000，一个id选择器+100，一个属性选择器、class或者伪类+10，一个元素选择器，或者伪元素+1，通配符+0*

#### flex

`flex`属性是`flex-grow`, `flex-shrink` 和 `flex-basis`的简写，默认值为`0 1 auto`。后两个属性可选。

`flex-grow` 放大比例，默认为0

`flex-shrink`缩小比例(默认为1， 空间不够将自动缩小)

`flex-basis`属性定义了在分配多余空间之前，项目占据的主轴空间（main size）

#### BFC

每一个BFC区域只包括其子元素，不包括其子元素的子元素
每一个BFC区域都是独立隔绝的,互不影响!

* 触发条件, 下列任何一个

body根元素

·设置浮动，不包括none

·设置定位，absoulte或者fixed

·行内块显示模式，inline-block

·设置overflow，即hidden，auto，scroll

·表格单元格，table-cell

·弹性布局，flex

#### 图片优化

jpg png png8 png24 webp

#### 样式隔离



