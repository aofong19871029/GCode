package com.joker.donghua;

/**
 * 多线程测试类
 *
 */
public class ThreadTest {

    public static void main(String[] args) {
        ThreadA threadA = new ThreadA();
        ThreadB threadB = new ThreadB();
        threadA.start();
        threadB.start();
    }
}
