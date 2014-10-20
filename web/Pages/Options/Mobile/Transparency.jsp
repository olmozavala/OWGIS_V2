<%-- 
    Document   : Transparency
    Created on : Aug 3, 2012, 6:19:41 PM
    Author     : Olmo Zavala-Romero
--%>

<%--
This page controls the transparency of the layer being previewed. The transparency is not a call to the server itself
but a service offered by the OpenLayers Library.

--%>



<span  class="defaultOptions" style="cursor:default" > 
	
    <table cellpadding="0" border="0">
        <tr>
            <td><button id="minusButtonTrans" class="mobileButton"  type="button" disabled="disabled" onclick="owgis.transparency.changeTransp(.15);">
                    -

                </button></td>

            <td>
                <span style="cursor: default;" id="transText" class="transText middleText"><fmt:message key="ncwms.trans" /></span>
            </td>
            <td>


                <button id="plusButtonTrans" type="button" class="mobileButton" onclick="owgis.transparency.changeTransp(-.15);">
                    +

                </button>

            </td>
        </tr>
    </table>


</span>
