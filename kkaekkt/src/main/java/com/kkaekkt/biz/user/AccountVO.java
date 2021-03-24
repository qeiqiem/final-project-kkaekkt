package com.kkaekkt.biz.user;

public class AccountVO {
    private String id;
    private String password;
    private String name;
    private String phone;
    private String address;
    private String bmail;
    private String mmail;
    private int mtype;
    private int idchk;
    private String authkey;
    
    
	public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public int getMtype() {
        return mtype;
    }
    public void setMtype(int mtype) {
        this.mtype = mtype;
    }
	public String getBmail() {
		return bmail;
	}
	public void setBmail(String bmail) {
		this.bmail = bmail;
	}
	public String getMmail() {
		return mmail;
	}
	public void setMmail(String mmail) {
		this.mmail = mmail;
	}
	public String getAuthkey() {
		return authkey;
	}
	public void setAuthkey(String authkey) {
		this.authkey = authkey;
	}
	@Override
	public String toString() {
		return "AccountVO [id=" + id + ", password=" + password + ", name=" + name + ", phone=" + phone + ", address="
				+ address + ", bmail=" + bmail + ", mmail=" + mmail + ", mtype=" + mtype + ", idchk=" + idchk
				+ ", authkey=" + authkey + "]";
	}


    
}
