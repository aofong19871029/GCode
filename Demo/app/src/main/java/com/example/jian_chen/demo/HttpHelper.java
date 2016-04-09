package com.example.jian_chen.demo;
import android.os.StrictMode;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.BufferedReader;
import java.util.Map;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.json.JSONObject;
//import org.apache.http.entity.StringEntity;

/**
 * Created by jian_chen on 2016/4/9.
 */
public class HttpHelper {
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
}
