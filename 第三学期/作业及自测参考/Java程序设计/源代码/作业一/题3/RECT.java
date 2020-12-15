package com.joker.donghua;

/**
 * 编写Java Application程序，定义一个矩形类RECT:
 * 类的属性成员包括矩形的宽 width 和 高 height，
 * 成员方法包括带参数和不带参数的构造函数、两个属性的get方法和set方法、计算面积的方法 Area（）。
 * 在main（）定义RECT的对象，使用它的一些方法进行一些操作。提交程序代码和程序运行结果截图
 *
 */
public class RECT {
    /**
     * 矩形-宽
     */
    private float width;

    /**
     * 矩形-高
     */
    private float height;

    public float getWidth() {
        return width;
    }

    public void setWidth(float width) {
        this.width = width;
    }

    public float getHeight() {
        return height;
    }

    public void setHeight(float height) {
        this.height = height;
    }

    /**
     * 无参构造
     */
    public RECT() {
    }

    /**
     * 有参构造
     *
     * @param width
     * @param height
     */
    public RECT(float width, float height) {
        this.width = width;
        this.height = height;
    }

    /**
     * 面积计算方法
     *
     * @return
     */
    private float Area() {
        return width * height;
    }

    public static void main(String[] args) {
        // 使用无参构造创建对象 并 计算面积
        RECT rect = new RECT();
        rect.setHeight(1);
        rect.setWidth(2);
        System.out.println("曹会金:使用无参构造创建对象 并 计算面积:" + rect.Area());
        // 使用有参构造创建对象 并 计算面积
        RECT rect2 = new RECT(2, 3);
        System.out.println("曹会金:使用有参构造创建对象 并 计算面积:" + rect2.Area());
    }
}
