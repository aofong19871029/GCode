package com.joker.donghua;

import javax.swing.*;
import java.awt.*;

/**
 * 编写一个GUI程序，界面上包含一个按钮，点击按钮后在界面上画一个矩形。提交程序代码和程序运行结果截图。
 *
 */
public class GuiTest {
    public static void main(String[] args) {
        // 1. 创建一个顶层容器（窗口）
        JFrame jf = new JFrame("曹会金-GuiTest");
        // 设置窗口大小
        jf.setSize(250, 250);
        // 把窗口位置设置到屏幕中心
        jf.setLocationRelativeTo(null);
        // 当点击窗口的关闭按钮时退出程序
        jf.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);

        // 2. 创建中间容器（面板容器） 使用默认的布局管理器
        JPanel panel = new JPanel();
        // 3. 创建一个基本组件（按钮），并添加到 面板容器 中
        JButton btn = new JButton("GuiTestButton");
        btn.addActionListener(e -> {
            Graphics graphics = panel.getGraphics();
            Graphics2D g2d = (Graphics2D) graphics.create();
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
            g2d.setColor(Color.GRAY);
            // 绘制一个矩形: 起点(30, 20), 宽80, 高100
            g2d.drawRect(85, 50, 80, 100);
        });
        panel.add(btn);
        // 4. 把 面板容器 作为窗口的内容面板 设置到 窗口
        jf.setContentPane(panel);
        // 5. 显示窗口，前面创建的信息都在内存中，通过 jf.setVisible(true) 把内存中的窗口显示在屏幕上。
        jf.setVisible(true);
    }
}
