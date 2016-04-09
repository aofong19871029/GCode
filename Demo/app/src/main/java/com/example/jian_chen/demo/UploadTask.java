package com.example.jian_chen.demo;

import android.os.AsyncTask;
import android.widget.Toast;

import com.video.TestBasicVideo;

import java.io.IOException;
import java.util.Map;

/**
 * Created by jian_chen on 2016/4/10.
 */
public class UploadTask extends AsyncTask<String, Integer, String> {
    private  String url;
    private String videoPath;
    private TestBasicVideo _actity;

    public UploadTask(String url,String videoPath, TestBasicVideo actity){
        this.url = url;
        this.videoPath = videoPath;
        _actity = actity;
    }

    @Override
    protected String doInBackground(String... params) {
        try {
            return HttpHelper.Upload(this.url, videoPath);
        }
        catch (IOException ex){
            return  "";
        }
    }

    @Override
    protected void onPostExecute(String result) {   // 可以与UI控件交互
        if(!result.isEmpty()){
            _actity.toast("上传成功");
        }
    }
}
