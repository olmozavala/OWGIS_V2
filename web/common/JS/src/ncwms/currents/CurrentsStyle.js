goog.provide('owgis.ncwms.currents.style')

goog.require('owgis.ncwms.currents.particles')

owgis.ncwms.currents.style.togglestyling = function toggleWindow(){
	$("#currentsControlsContainer").toggle();
}

owgis.ncwms.currents.style.init = function init(){
	initPicker();
	iniSliderNumParticles();
	iniSliderParticlesSpeed();
}

function initPicker(){
	$('#customizeCurrents').spectrum( {
		color: owgis.ncwms.currents.getColor(),
		alpha:.5,
		chooseText:"Close",
		cancelText:"",
		showAlpha:true,
		containerClassName:"colorPickerContainer",
		move: setColor
	});
}

function iniSliderParticlesSpeed(){
	$("#particleSpeedSlider").slider({
		max:30,
		min:0,
		value:owgis.ncwms.currents.particles.getParticleSpeed()*100,
		change: setParticlesSpeed
	});
}

function iniSliderNumParticles(){
	$("#numParticlesSlider").slider({
		max:20000,
		min:100,
		value:owgis.ncwms.currents.particles.getNumParticles (),
		change: setNumParticles
	});
	$("#numParticles").text( owgis.ncwms.currents.particles.getNumParticles ());
}
function setParticlesSpeed(event, ui){
	owgis.ncwms.currents.particles.setParticleSpeed(ui.value/100);
}
function setNumParticles(event, ui){
	$("#numParticles").text( ui.value );
	owgis.ncwms.currents.particles.setNumParticles(ui.value);
}

function setColor(color){
	owgis.ncwms.currents.setColor(color.toRgbString());
}