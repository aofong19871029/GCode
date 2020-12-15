package donghua;

import java.applet.Applet;
import java.awt.*;

/**
 * 以坐标点 (10,10)为左上角绘制宽为30，高为20的红颜色线矩形
 */
public class DrawRec extends Applet {
    @Override
    public void paint(Graphics g) {
    	g.setColor(Color.RED);
        g.drawRect(10, 10, 30, 20);
    }
}
