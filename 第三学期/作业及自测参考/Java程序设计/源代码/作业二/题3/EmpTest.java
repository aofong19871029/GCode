package com.joker.donghua;

/**
 * 雇员测试类
 * 为5号计算机网络专业的23岁男性雇员王强定义一个相应的对象emp，并调用对象的PrintEMP ()方法在屏幕上显示其信息
 *
 */
public class EmpTest {

    public static void main(String[] args) {
        EMP emp = new EMP();
        emp.setID(5);
        emp.setName("王强");
        emp.setAge(23);
        emp.setSex("男");
        emp.setMajor("计算机网络专业");
        emp.PrintEMP();
    }
}
