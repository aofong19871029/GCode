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
import android.widget.VideoView;

public class MediaActivity extends Activity {
    private VideoView v1,v2;

    private String FilePath = "/sdcards/1460237867710.mp4";


    private String FilePath2 = "/sdcards/1460189177258.mp4";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        requestWindowFeature(Window.FEATURE_NO_TITLE);// 去掉标题栏
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_media);

        v1 = (VideoView)findViewById(R.id.vv1);
        v2 = (VideoView)findViewById(R.id.vv2);

        v1.setVideoPath(FilePath);
        v2.setVideoPath(FilePath2);
        v1.start();
        v2.start();

    }

}
