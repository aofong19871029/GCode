<%@ page language="java" pageEncoding="UTF-8"%>

<%@ taglib uri="http://jakarta.apache.org/struts/tags-bean" prefix="bean" %>
<%@ taglib uri="http://jakarta.apache.org/struts/tags-html" prefix="html" %>
<%@ taglib uri="http://jakarta.apache.org/struts/tags-logic" prefix="logic" %>
<%@ taglib uri="http://jakarta.apache.org/struts/tags-tiles" prefix="tiles" %>
<%@ taglib uri="http://jakarta.apache.org/struts/tags-nested" prefix="nested" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core"  prefix="c"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html:html locale="true">
  <head>
    <html:base />
    
    <title>addContact.jsp</title>

	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

	<link href="style/mycss.css" rel="stylesheet" type="text/css" />
	<link href="style/texts.css" rel="stylesheet" type="text/css" />
	<link href="style/btn.css" rel="stylesheet" type="text/css" />

  </head>
  
  <BODY BGCOLOR=#FFFFFF LEFTMARGIN=0 TOPMARGIN=0 MARGINWIDTH=0
		MARGINHEIGHT=0>

		<table width="780" border="0" align="center" cellpadding="0"
			cellspacing="0">
			<tr height="33">
				<td colspan="3">
					<br>
				</td>
			</tr>
			<tr>
				<td colspan="3">
					<img src="images/top.jpg" width="777" height="23">
				</td>
			</tr>
			<tr>
				<td width="19" background="images/middle2.jpg">
					&nbsp;
				</td>

				<td width="695">
					<table width="98%">
						<tr>
							<td width="3%">
								&nbsp;
							</td>
							<td width="97%">
								<form action="add.do" method="post">
									<table width="88%">
										<tr>
											<td colspan="2">
												ADD NEW CONTACT DETAILS
											</td>
										</tr>
										<tr>
											<td colspan="2">
												<hr />
											</td>
										</tr>
										<tr>
											<td>
												<strong>FIRST NAME：</strong>
											</td>
											<td>
												<input type="text" name="firstName">
											</td>
										</tr>
										<tr>
											<td>
												<strong>LAST NAME：</strong>
											</td>
											<td>
												<input type="text" name="lastName">
											</td>
										</tr>
										<tr>
											<td>
												<strong>JOB TITLE：</strong>
											</td>
											<td>
												<input type="text" name="jobTitle" />
											</td>
										</tr>
										<tr>
											<td>
												<strong>DEPARTMENT：</strong>
											</td>
											<td>
												<input type="text" name="department" />
											</td>
										</tr>
										<tr>
											<td>
												<strong>PHONE：</strong>
											</td>
											<td>
												<input type="text" name="phone">
											</td>
										</tr>
										<tr>
											<td>
												<strong>MOBILE：</strong>
											</td>
											<td>
												<input type="text" name="mobile">
											</td>
										</tr>
										<tr>
											<td>
												<strong>E-MAIL：</strong>
											</td>
											<td>
												<input type="text" name="email">
											</td>
										</tr>
										<tr>
											<td colspan="2">
												<div align="center">
													<input type="submit" value="SAVE" class="btn"> <input type="reset" value="RESET" class="btn">
												</div>
											</td>
										</tr>
									</table>
								</form>

							</td>
						</tr>

					</table>
				</td>
				<td width="40" background="images/middle4.jpg">
					&nbsp;
				</td>
			</tr>
			<tr>
				<td colspan="3">
					&nbsp;<img src="images/bottom.jpg" width="760" height="23">
				</td>
			</tr>
		</table>
		<P align="center">
			2010 XXX Information Technology Co.,Ltd 版权所有
		</P>
		<br />
	</BODY>
</html:html>
