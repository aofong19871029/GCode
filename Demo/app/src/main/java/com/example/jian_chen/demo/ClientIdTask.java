package com.example.jian_chen.demo;

import android.app.Activity;
import android.os.AsyncTask;

import com.video.TestBasicVideo;

import java.io.IOException;
import java.util.Map;

/**
 * Created by jian_chen on 2016/4/9.
 */

public class ClientIdTask extends AsyncTask<String, Integer, String> {
    private  TestBasicVideo _activity;
    private  String url;
    private  Map<String, String> params;

    public ClientIdTask(TestBasicVideo a, String url, Map<String, String> params){
        this._activity = a;
        this.url = url;
        this.params = params;
    }

    @Override
    protected String doInBackground(String... params) {
        try {
            return HttpHelper.Post(this.url, this.params, null);
        }
        catch (IOException ex){
            return  "";
        }
    }

    @Override
    protected void onPostExecute(String result) {   // 可以与UI控件交互
        this._activity.SetClientId(Long.parseLong(result));
    }
}

