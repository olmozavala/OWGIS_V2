<!-- This displays the current palette and the color range used on it -->

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>

<a href="#" id="trigger3" class="trigger right">Palettes</a>
				<div id="panel3" class="panel right">
					
					<div class="row">
						<div class="col-xs-2">
							<img class="optPaletteImg" id="imgPalette" src="${paletteUrl}"
								 onclick="displayOptionalPalettes();"
								 onmouseover="this.style.cursor = 'pointer';"
								 onmouseout="this.style.cursor = 'crosshair';" />
						</div>
						<div class="col-xs-10">
							<div class="row">
								<div class="col-xs-12 invShadow title ">
									<fmt:message key="ncwms.colorrange" />
								</div>
							</div>
							<div class="row ">
								<div class="col-xs-12 defRowSpace">
									<span class="invShadow"> Max:</span> <input id="maxPal"
																				class="inputSizePalettes input-sm" name="maxPal" type="text"
																				size="5" onblur="UpdatePalette(mappalette);" style="color: black"
																				onkeydown="if (event.keyCode == 13) UpdatePalette(mappalette);" />
									<a class="btn btn-default btn-xs" href="#"
									   onclick="increaseMaxColorRange(1);"> <span
											class="glyphicon glyphicon-plus "> </span>
									</a> <a class="btn btn-default btn-xs" href="#"
											onclick="increaseMaxColorRange(-1);"> <span
											class="glyphicon glyphicon-minus "> </span>
									</a>
								</div>
							</div>
							<div class="row ">
								<div class="col-xs-12 defRowSpace">
									<span class="buttonStyle" id="updateColorRangeButton"
										  onclick="UpdatePalette(mappalette);"> <fmt:message
											key="ncwms.update" /></span> <span class="buttonStyle"
												  id="autoColorRangeButton" onclick="setColorRangeFromMinMax();">
										<fmt:message key="ncwms.auto" />
									</span>
								</div>
							</div>
							<div class="row">
								<div class="col-xs-12 defRowSpace ">
									<span class="invShadow"> Min:</span> <input
										class="inputSizePalettes input-sm" id="minPal" name="minPal"
										type="text" size="5" onblur="UpdatePalette(mappalette);"  style="color: black"
										onkeydown="if (event.keyCode == 13) UpdatePalette(mappalette);" />
									<a class="btn btn-default btn-xs" href="#"
									   onclick="decreaseMinColorRange(-1);"> <span
											class="glyphicon glyphicon-plus "> </span>
									</a> <a class="btn btn-default btn-xs" href="#"
											onclick="decreaseMinColorRange(1);"> <span
											class="glyphicon glyphicon-minus "> </span>
									</a>
									
								</div>
							</div>
							<!-- Row -->
						</div>
						<!-- col-xs-10 -->
					</div>
					<!-- Row -->
					<div class="row defRowSpace">
						<div class="col-xs-6 invShadow title">
							<fmt:message key="ncwms.newpal" />
						</div>
						<div class="col-xs-4">
							<span class="buttonStyle" id="defaultColorRangeButton"
								  onclick="DefaultPalette();"> Default</span>
						</div>
						
					</div>
					<div class="row defRowSpace">
						<div class="col-xs-12">
							<table id="palettesTable"></table>
						</div>
					</div>
				</div>