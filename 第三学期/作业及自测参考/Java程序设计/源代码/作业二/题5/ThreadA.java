package com.joker.donghua;

/**
 * 线程A 输出I am Thread A
 */
public class ThreadA extends Thread {

    @Override
    public void run() {
        super.run();
        System.out.println("I am Thread A");
    }
}
