package donghua;
import java.applet.*;
import java.awt.*;
/**
 * 编写一个Java Applet程序，使之能在浏览器中显示： Hello Java Applet World！提交Java程序代码、嵌入小程序的HTML文档和运行结果截图
 *
 */
public class HelloWorldApplet extends Applet{
    @Override
    public void paint(Graphics g){
        g.drawString("Hello Java Applet World！", 5, 30);//绘制文本
    }
}