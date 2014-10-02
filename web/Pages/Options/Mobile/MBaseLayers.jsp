
<%@page errorPage="Error/ErrorPage.jsp"%>
<%@ taglib prefix="menuHelper" uri="/WEB-INF/TLD/htmlStaticFunctions.tld"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<!-- This sections generate the menu of optional layers, normally vector layers -->
<div class="row " onClick="toogleList('#baseLayersData')">
							<div class="col-xs-9 text-center noShadow title">
								<fmt:message key="main.base" />
							</div>
							<div class="col-xs-3 text-center">
								<a class="btn btn-default btn-xs" href="#"
								   onclick="minimizeWindow('mainMenuMinimize', 'mainMenuParent')">
									<i class="glyphicon glyphicon-resize-small"></i>
								</a>
							</div>
						</div>
						<div class="row" id="baseLayersData">
							<div class="col-xs-12 " style="margin-left: 4px;">
								${menuHelper:createMainMenu(MenuDelUsuario,language)}</div>
						</div>
						<c:if test="${cqlfilter}">
							<div class="row">
								<div class="col-xs-12">
									<span id="ocqlMenuButtonParent">
										<button type="button" name="type" id="idOcqlMenuButton"
												class="buttonStyle" onclick="toggleCustomFilterTextBox();">
											<fmt:message key="cql.custom" />
										</button>
									</span>
								</div>
							</div>
						</c:if>