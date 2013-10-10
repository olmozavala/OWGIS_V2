// Default colors for links
var colorLink;
var colorLinkOver;
var colorLinkClick;
var colorLinkDisabled;

if(mapConfig['menuDesign']=='sideMenu'){
	colorLink = "#0D3D52"; // When the mouse is not over and is not being clicked
	colorLinkOver = "#467387"; // When the mouse is over
	colorLinkClick = "#72919E";	// When the button is being clicked
	colorLinkDisabled = "darkgray";	// When the button is disabled
}else{
	colorLink = "#CDF1FA"; // When the mouse is not over and is not being clicked
	colorLinkOver = "#91B6FF"; // When the mouse is over
	colorLinkClick = "#1B2DFF";	// When the button is being clicked
	colorLinkDisabled = "gray";	// When the button is disabled
}