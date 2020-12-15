package com.joker.donghua;

import java.util.InputMismatchException;
import java.util.Scanner;

/**
 * 编写一个Java程序，能从键盘上接收两个整数，然后计算两个数的乘积
 *
 */
public class Product {
    public static void main(String[] args) {
        Scanner cin = new Scanner(System.in);
        try {
            System.out.println("请输入第一个数字");
            float firstNum = cin.nextFloat();
            System.out.println("请输入第二个数字");
            float secondNum = cin.nextFloat();
            System.out.println("两个数字的乘积是:" + (firstNum * secondNum));
        } catch (InputMismatchException e) {
            System.out.println("输入数据格式错，要求是数字！");
        }
    }
}
