package com.joker.donghua;

/**
 * 雇员类
 *
 */
public class EMP {

    public EMP() {
    }

    public EMP(int ID, String name, int age, String sex, String major) {
        this.ID = ID;
        Name = name;
        Age = age;
        Sex = sex;
        Major = major;
    }

    public void PrintEMP() {
        System.out.println("雇员id:" + this.ID);
        System.out.println("雇员名称:" + this.Name);
        System.out.println("雇员年龄:" + this.Age);
        System.out.println("雇员性别:" + this.Sex);
        System.out.println("雇员专业:" + this.Major);
    }

    private int ID;
    private String Name;
    private int Age;
    private String Sex;
    private String Major;

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public int getAge() {
        return Age;
    }

    public void setAge(int age) {
        Age = age;
    }

    public String getSex() {
        return Sex;
    }

    public void setSex(String sex) {
        Sex = sex;
    }

    public String getMajor() {
        return Major;
    }

    public void setMajor(String major) {
        Major = major;
    }
}
