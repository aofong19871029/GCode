package com.example.jian_chen.demo;
import android.os.StrictMode;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;
//import org.apache.http.entity.StringEntity;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Created by jian_chen on 2016/4/9.
 */
public class HttpHelper {
    public static String getPairID(String url, String param) throws IOException {

        URL postUrl = new URL(url);

        HttpURLConnection connection = (HttpURLConnection) postUrl.openConnection();

        connection.setRequestMethod("POST");

        connection.setUseCaches(false);

        connection.setInstanceFollowRedirects(true);

        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        DataOutputStream postStream = new DataOutputStream(connection.getOutputStream());

        String content = param; //"{\"UserID\":654321}";

        postStream.writeBytes(content);

        postStream.flush();

        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

        String temp;
        String pairId = "";

        while ((temp = reader.readLine()) != null) {
            pairId += temp;
        }

        try {
            JSONObject json = new JSONObject(pairId);
            return json.getString("PairID");

        } catch (JSONException ex) {
            return "";
        }
    }

    public static String Post(String url, Map<String, String> params, JSONObject jsonParam) throws IOException {
        String line = "";

        StringBuffer response = new StringBuffer();
        HttpClient client = new HttpClient();
        HttpMethod method = new PostMethod(url);

        if(params != null){
            HttpMethodParams p = new HttpMethodParams();
            for (Map.Entry<String, String> entry : params.entrySet()) {
                p.setParameter(entry.getKey(), entry.getValue());
            }
            method.setParams(p);
        }

        if(jsonParam != null){

//            StringEntity entity = new StringEntity(jsonParam.toString(), "utf-8");
//            entity.setContentEncoding("UTF-8");
//            entity.setContentType("application/json");
        }

        try {
          int t=  client.executeMethod(method);
            if (method.getStatusCode() == HttpStatus.SC_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(method.getResponseBodyAsStream(), "utf-8"));


                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();
            }
        } catch (IOException ex) {
            throw ex;
        } catch (Exception ex) {
            ex.printStackTrace();
        } finally {
            method.releaseConnection();
        }

        return line;
    }

    public static String Upload(String url, String videoPath) throws IOException {

//     Map<String, String> params = new HashMap<String, String>();

//        File video = new File(videoPath);
//
//
//        params.put("fileTypes", "mp4");
//        params.put("method", "upload");


        URL postUrl = new URL(url);

        HttpURLConnection connection = (HttpURLConnection) postUrl.openConnection();

        connection.setRequestMethod("POST");

        connection.setUseCaches(false);

        connection.setInstanceFollowRedirects(true);

        connection.setRequestProperty("Content-Type", "text/html");
        connection.setDoOutput(true);

        DataOutputStream postStream = new DataOutputStream(connection.getOutputStream());

        File video = new File(videoPath);
        FileInputStream fs = new FileInputStream(video);
        byte[] buffer = new byte[1024];
        int length = -1;
        while((length = fs.read(buffer)) != -1){
            postStream.write(buffer, 0, 1024);
        }

        fs.close();

//        String content = param; //"{\"UserID\":654321}";
//
//        postStream.writeBytes(content);

        postStream.flush();

        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));

        String temp;
        String pairId = "";

        while ((temp = reader.readLine()) != null) {
            pairId += temp;
        }

        try {
            JSONObject json = new JSONObject(pairId);
//            return json.getString("PairID");

        } catch (JSONException ex) {
//            return "";
        }

        return "";
    }

}
