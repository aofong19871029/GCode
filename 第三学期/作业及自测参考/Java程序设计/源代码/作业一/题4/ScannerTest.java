package com.joker.donghua;

import java.util.Scanner;

/**
 * 使用Scanner类的对象，从键盘输入两个 接收两个数，然后计算这两个数的乘积。提交程序代码和程序运行结果截图。
 *
 */
public class ScannerTest {

    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        // 从键盘接收数据
        // next方式接收字符串
        System.out.println("曹会金:请输入第一个数字：");
        // 判断是否还有输入
        float firstNum = scan.nextFloat();
        System.out.println("曹会金:请输入第一个数字：");
        float secondNum = scan.nextFloat();
        System.out.println("曹会金:请输入第一个数字：" + (firstNum * secondNum));
        scan.close();
    }
}
