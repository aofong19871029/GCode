package com.dao;

/**
 * Addresstable entity. @author MyEclipse Persistence Tools
 */
public class Addresstable extends AbstractAddresstable implements
		java.io.Serializable {

	// Constructors

	/** default constructor */
	public Addresstable() {
	}

	/** full constructor */
	public Addresstable(String firstName, String lastName, String jobTitle,
			String department, String phone, String mobile, String email) {
		super(firstName, lastName, jobTitle, department, phone, mobile, email);
	}

}
