package com.joker.donghua;

/**
 * 线程B 输出I am Thread B
 *
 */
public class ThreadB extends Thread {

    @Override
    public void run() {
        super.run();
        System.out.println("I am Thread B");
    }
}
