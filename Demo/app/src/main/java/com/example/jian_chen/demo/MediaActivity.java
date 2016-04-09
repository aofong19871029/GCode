package com.video;

import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Locale;


import android.app.Activity;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnBufferingUpdateListener;
import android.media.MediaPlayer.OnCompletionListener;
import android.media.MediaPlayer.OnErrorListener;
import android.media.MediaPlayer.OnPreparedListener;
import android.media.MediaPlayer.OnSeekCompleteListener;
import android.media.MediaPlayer.OnVideoSizeChangedListener;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceHolder.Callback;
import android.view.SurfaceView;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.Button;
import android.widget.SeekBar;
import android.widget.SeekBar.OnSeekBarChangeListener;
import android.widget.TextView;

public class MediaActivity extends Activity implements SurfaceHolder.Callback {

    private SurfaceView surfaceView;
    private MediaPlayer mediaPlayer;
    private String FilePath = "/sdcards/1460189269074.mp4";

    private SurfaceView surfaceView2;
    private MediaPlayer mediaPlayer2;
    private String FilePath2 = "/sdcards/1460189177258.mp4";

    private boolean isSurfaveCreated1 = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);// 去掉标题栏
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_media);

        initData1();
//        initData2();
    }

    private SurfaceHolder holder1;
    private void initData1() {
//      FilePath="/sdcard/video/sishui.avi";
        surfaceView = (SurfaceView) findViewById(R.id.sv);
        mediaPlayer = new MediaPlayer();
        mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);//设置视频流类型

        mediaPlayer.setOnPreparedListener(new OnPreparedListener() {

            @Override
            public void onPrepared(MediaPlayer mp) {
                mediaPlayer.start();
            }
        });
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // TODO Auto-generated method stub
                try {
                    mediaPlayer.setDisplay(surfaceView.getHolder());
                    mediaPlayer.setDataSource(FilePath);
                    mediaPlayer.prepareAsync();
                } catch (Exception e) {   ///在这里增加播放失败.
                    mediaPlayer.release();
                    if(mediaPlayer!=null)
                    e.printStackTrace();
                }
            }
        }, 200);



//        try {
//            holder1 = surfaceView.getHolder();// 取得holder
//            holder1.addCallback(this); // holder加入回调接口
//            // setType必须设置，要不出错.
//            holder1.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
//
//            surfaceView.getHolder().setFixedSize(1280, 720);
//            // 设置该组件让屏幕不会自动关闭
//            surfaceView.getHolder().setKeepScreenOn(true);
//
//            mediaPlayer.setDisplay(surfaceView.getHolder());
//            mediaPlayer.setDataSource(FilePath);
//            mediaPlayer.prepareAsync();
//        } catch (Exception e) {   ///在这里增加播放失败.
//            mediaPlayer.release();
//            if(mediaPlayer!=null)
//                e.printStackTrace();
//        }
    }

    private void initData2() {
        surfaceView2 = (SurfaceView) findViewById(R.id.sv2);
        mediaPlayer2 = new MediaPlayer();
        mediaPlayer2.setAudioStreamType(AudioManager.STREAM_MUSIC);//设置视频流类型

        mediaPlayer2.setOnPreparedListener(new OnPreparedListener() {

            @Override
            public void onPrepared(MediaPlayer mp) {
                mediaPlayer2.start();
                Log.i("sno","start mediaPlayer2----------------");
            }
        });

        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                // TODO Auto-generated method stub
                try {
                    mediaPlayer2.setDisplay(surfaceView2.getHolder());
                    mediaPlayer2.setDataSource(FilePath2);
                    mediaPlayer2.prepareAsync();
                } catch (Exception e) {   ///在这里增加播放失败.
                    mediaPlayer2.release();
                    if(mediaPlayer2!=null){

                    }
                    e.printStackTrace();
                }
            }
        }, 200);
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width,
                               int height) {
        // 将holder，这个holder为开始在oncreat里面取得的holder，将它赋给surfaceHolder
        holder1 = holder;
        isSurfaveCreated1 = true;
    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        // 将holder，这个holder为开始在oncreat里面取得的holder，将它赋给surfaceHolder
        holder1 = holder;
        isSurfaveCreated1 = true;
    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        // surfaceDestroyed的时候同时对象设置为null
        surfaceView = null;
        holder1 = null;
        holder1 = null;
    }
}
