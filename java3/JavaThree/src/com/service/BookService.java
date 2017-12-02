package com.service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.mysql.jdbc.ResultSet;
import com.mysql.jdbc.Statement;
import com.pojo.Book;


public class BookService {
	static String driver;
	static String url;
	static String userName;
	static String password;
	
	public BookService(){
		try {
			Properties prop = new Properties();
			prop.load(this.getClass().getResourceAsStream("db.properties"));
			
			driver = prop.getProperty("driver");
			url = prop.getProperty("url");
			userName = prop.getProperty("username");
			password = prop.getProperty("password");
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
	}
	
	public List getBookList() {
		List list = new ArrayList();
		
		try {
			Class.forName(driver);
			Connection conn = DriverManager.getConnection(url, userName, password);
			Statement stat = (Statement) conn.createStatement();
			ResultSet rs = (ResultSet) stat.executeQuery("select * from tbl_books");
			
			while (rs.next()) {
				Book book = new Book();
				
				book.setIsbn(rs.getString("isbn"));
				book.setPrice(rs.getString("price"));
				book.setTitle(rs.getString("title"));
				list.add(book);
				
			}
		} catch (Exception e) {
			// TODO: handle exception
		}
		
		return list;
	}

}
