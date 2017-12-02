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
    
    <title>list.jsp</title>

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
				<td colspan="5">
					<br>
				</td>
			</tr>
			<tr>
				<td colspan="5">
					<img src="images/top.jpg" width="771" height="23">
				</td>
			</tr>
			<tr>
				<td width="19" background="images/middle2.jpg">
					&nbsp;
				</td>

				<td width="695">
					<table>
						<tr>
							<td width="3%">
								&nbsp;
							</td>
							<td width="97%">
								<table width="688">
									<tr>
										<TD width='10%' height="30" align='center'>
											FIRST NAME
										</TD>
										<TD width='10%' align='center'>
											LAST NAME
										</TD>
										<TD align='center' width="15%">
											JOB TITLE
										</TD>
										<TD width='15%' align='center'>
											DEPARTMENT
										</TD>
										<TD align='center' width="10%">
											PHONE
										</TD>
										<TD align='center' width="15%">
											MOBILE
										</TD>
										<TD align='center' width="25%">
											E-MAIL
										</TD>
									</tr>
									<tr>
										<td colspan='7'>
											<hr />
										</td>
									</tr>
									<c:forEach items="${list}" var="a">
									<tr>
										<td align='center'>
											<c:out value="${a.firstName}"></c:out>
										</td>
										<td align='center' style='height: 30px;'>
											<c:out value="${a.lastName}"></c:out>
										</td>
										<td align='center'>
											<c:out value="${a.jobTitle}"></c:out>
										</td>
										<td align='center' style='height: 30px;'>
											<c:out value="${a.department}"></c:out>
										</td>
										<td align='center'>
											<c:out value="${a.phone}"></c:out>
										</td>
										<td align='center'>
											<c:out value="${a.mobile}"></c:out>
										</td>
										<td align='center'>
											<c:out value="${a.email}"></c:out>
										</td>
									</tr>
									</c:forEach>						
									
									
									



									<tr>
										<td colspan='7'>
											<hr />
										</td>
									</tr>
								</table>



							</td>
						</tr>
						<tr>
							<td colspan="2"></td>
						</tr>
					</table>
				</td>
				<td width="40" background="images/middle4.jpg">
					&nbsp;
				</td>
			</tr>
			<tr>
				<td colspan="5" >
					&nbsp;<img src="images/bottom.jpg" width="754" height="23">
				</td>
			</tr>
		</table>
		<P align="center">
			2010 XXX Information Technology Co.,Ltd 版权所有
		</P>
		<br />
	</BODY>
</html:html>
