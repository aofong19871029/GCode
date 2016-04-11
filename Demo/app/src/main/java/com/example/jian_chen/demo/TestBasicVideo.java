package com.video;

import java.io.DataOutputStream;
import java.io.FileDescriptor;
import java.io.IOException;
import java.io.File;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Date;
import java.text.SimpleDateFormat;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Handler;
import java.util.logging.LogRecord;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.PixelFormat;
import android.media.CamcorderProfile;
import android.media.CameraProfile;
import android.media.MediaRecorder;
import android.net.LocalServerSocket;
import android.net.LocalSocket;
import android.net.LocalSocketAddress;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Message;
import android.os.ParcelFileDescriptor;
import android.os.StrictMode;
import android.text.format.DateUtils;
import android.view.KeyEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import com.example.jian_chen.demo.ClientIdTask;
import com.example.jian_chen.demo.HttpHelper;
import com.example.jian_chen.demo.UploadTask;
import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.common.api.GoogleApiClient;
import com.video.MediaActivity;

/**
 * class name：TestBasicVideo<BR>
 * class description：一个简单的录制视频例子<BR>
 * PS：实现基本的录制保存文件 <BR>
 *
 * @author CODYY)peijiangping
 * @version 1.00 2011/09/21
 */
public class TestBasicVideo extends Activity implements SurfaceHolder.Callback {

    private Button btnUpload;
    private EditText txtCode;
    private Button btnBrowser;

    private MediaRecorder mediarecorder;// 录制视频的类
    private SurfaceView surfaceview;// 显示视频的控件
    // 用来显示视频的一个接口，我靠不用还不行，也就是说用mediarecorder录制视频还得给个界面看
    // 想偷偷录视频的同学可以考虑别的办法。。嗯需要实现这个接口的Callback接口
    private SurfaceHolder surfaceHolder;
    private boolean status = false; //是否开始录制
    private String videoPath;
    private int videoType = 0;

    private long clientId;

    public long GetClientId(){
        return this.clientId;
    }

    public void SetClientId(long val) {
        this.txtCode.setText(Long.toString(val));
        this.clientId = val;
    }

    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;


    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);// 去掉标题栏
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);// 设置全屏
        // 设置横屏显示
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        // 选择支持半透明模式,在有surfaceview的activity中使用。
        getWindow().setFormat(PixelFormat.TRANSLUCENT);
        setContentView(R.layout.activity_test_basic_video);

        //网络请求异步
        if (Build.VERSION.SDK_INT > 9) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
        }



        init();
        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();
    }

    private void init() {

        surfaceview = (SurfaceView) this.findViewById(R.id.surfaceview);
        SurfaceHolder holder = surfaceview.getHolder();// 取得holder
        holder.addCallback(this); // holder加入回调接口
        // setType必须设置，要不出错.
        holder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);


        // 设置分辨率
        surfaceview.getHolder().setFixedSize(1280, 720);
        // 设置该组件让屏幕不会自动关闭
        surfaceview.getHolder().setKeepScreenOn(true);

        this.BindEvents();

        this.GetClientIdFromSOA();
    }

    private RadioButton leftEye;
    private RadioButton rightEye;
    private void BindEvents() {

        btnUpload = (Button) this.findViewById(R.id.btnUpload);
        txtCode = (EditText) this.findViewById(R.id.txtCode);


        btnUpload.setOnClickListener(new TestVideoListener());


        leftEye = (RadioButton)this.findViewById(R.id.leftEye);
        rightEye = (RadioButton)this.findViewById(R.id.rightEye);
        btnBrowser = (Button)this.findViewById(R.id.btnBrowser);

        leftEye.setOnClickListener(new TestVideoListener());
        rightEye.setOnClickListener(new TestVideoListener());
        btnBrowser.setOnClickListener(new TestVideoListener());
    }

    class TestVideoListener implements OnClickListener {

        @Override
        public void onClick(View v) {

            if (v == btnUpload) {
                SendFileToServer();
            }
            if(v == leftEye){
                videoType = 0;
            }
            if(v == rightEye){
                videoType = 1;
            }
            if(v==btnBrowser){
                gpTpViewPics();
            }
        }

    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width,
                               int height) {
        // 将holder，这个holder为开始在oncreat里面取得的holder，将它赋给surfaceHolder
        surfaceHolder = holder;
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        // 将holder，这个holder为开始在oncreat里面取得的holder，将它赋给surfaceHolder
        surfaceHolder = holder;
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        // surfaceDestroyed的时候同时对象设置为null
        surfaceview = null;
        surfaceHolder = null;
        mediarecorder = null;
    }

    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        int action = event.getAction();

        if (action == KeyEvent.ACTION_DOWN || action == KeyEvent.ACTION_UP) {
            String dir = "";
            if (action == KeyEvent.ACTION_DOWN) {
                dir = "-音量";
            }

            if (action == KeyEvent.ACTION_UP) {
                dir = "+音量";
            }

//            Toast.makeText(getApplicationContext(), dir, Toast.LENGTH_SHORT).show();
        }

        return super.dispatchKeyEvent(event);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_VOLUME_DOWN:
            case KeyEvent.KEYCODE_VOLUME_UP:
                if (this.status) {
                    StopRecord();
                } else {
                    StartRecord();
                }
                status = !status;
                return true;
            case KeyEvent.KEYCODE_VOLUME_MUTE:
                break;
        }
        return super.onKeyDown(keyCode, event);
    }

    private void StartRecord() {
        if (mediarecorder == null) {
            mediarecorder = new MediaRecorder();// 创建mediarecorder对象
        }
        this.videoPath = null;

        mediarecorder.reset();

        // 设置录制视频源为Camera(相机)
        mediarecorder.setVideoSource(MediaRecorder.VideoSource.CAMERA);



        // 设置录制声音来源
        mediarecorder.setAudioSource(MediaRecorder.AudioSource.MIC);

        // 设置录制完成后视频的封装格式THREE_GPP为3gp.MPEG_4为mp4
        mediarecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);


        // 设置录制的视频编码h263 h264, 音频编码
        mediarecorder.setVideoEncoder(MediaRecorder.VideoEncoder.H264);
        mediarecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

        // 设置视频录制的分辨率。必须放在设置编码和格式的后面，否则报错
        mediarecorder.setVideoSize(176, 144);
        // 设置录制的视频帧率。必须放在设置编码和格式的后面，否则报错
        mediarecorder.setVideoFrameRate(20);
        //音码率
        mediarecorder.setAudioEncodingBitRate(3000000);

        mediarecorder.setPreviewDisplay(surfaceHolder.getSurface());

        File videoFile;

        try {
            // 创建保存录制视频的视频文件
            videoFile = new File(Environment.getExternalStorageDirectory().getCanonicalFile() + "/" + new Date().getTime() + ".mp4");
//            videoFile = new File("/sdcards/" + new Date().getTime() + ".mp4");
            this.videoPath = videoFile.getAbsolutePath();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        // 设置视频文件输出的路径
        mediarecorder.setOutputFile(this.videoPath);
        try {
            // 准备录制
            mediarecorder.prepare();
            // 开始录制
            mediarecorder.start();
        } catch (IllegalStateException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

    private void StopRecord() {
        if (mediarecorder != null) {

            // 停止录制
            mediarecorder.stop();
            // 释放资源
            mediarecorder.release();

            mediarecorder = null;
        }
    }

    private void SendFileToServer() {
        if (status || this.videoPath == null) return;

        String code = txtCode.getText().toString().trim();

        //获取code
        if (code.isEmpty()) {
            GetClientIdFromSOA();
        }
        //上传
        UploadVideo();
    }
    private void gpTpViewPics(){
        Intent intent = new Intent();
        intent.setClassName(getApplicationContext(), "com.video.MediaActivity");
        startActivity(intent);
    }

    private void GetClientIdFromSOA(){
        return;

//        ClientIdTask task = new ClientIdTask(this, "http://10.32.201.31/VRHackathonServer/json/reply/vrgetpairid", "{\"UserID\":654321}");
//        task.execute();
    }

    private void UploadVideo(){
        UploadTask task = new UploadTask("http://10.32.201.31/VRHackathonServer/api/UploadFile?userid=635621&pairid=" + this.GetClientId() + "&videoType="  + videoType , videoPath, this);
        task.execute();
    }

    public void toast(String msg){
        Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_LONG).show();
    }
}
