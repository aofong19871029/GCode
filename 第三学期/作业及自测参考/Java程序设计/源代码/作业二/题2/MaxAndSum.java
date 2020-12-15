package com.joker.donghua;

/**
 * 编写求一个整数数组A[10,15,12,9,7]中最大元素max和元素之和sum的程序
 *
 */
public class MaxAndSum {
    public static void main(String[] args) {
        int[] numArr = {10, 15, 12, 9, 7};
        int sum = 0;
        int max = 0;
        for (int item : numArr) {
            sum = sum + item;
            if (item > max) {
                max = item;
            }
        }
        System.out.println("数组之和sum=" + sum);
        System.out.println("最大元素max=" + max);
    }
}
