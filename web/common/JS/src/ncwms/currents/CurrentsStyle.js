goog.provide('owgis.ncwms.currents.style')

goog.require('owgis.ncwms.currents.particles')

owgis.ncwms.currents.style.togglestyling = function toggleWindow(){
	$("#currentsControlsContainer").toggle();
}

owgis.ncwms.currents.style.reset = function reset(){
	$("#particleSpeedSlider").slider("option","value",
		owgis.ncwms.currents.particles.getCurrentResolutionParticleSpeed() );

	$("#particleLifeTimeSlider").slider("option","value",
		owgis.ncwms.currents.particles.getDefaultParticlesLifeTime());

	$("#currentsColor").spectrum({color: owgis.ncwms.currents.getDefColor()});
	owgis.ncwms.currents.setColor(owgis.ncwms.currents.getDefColor());
}

owgis.ncwms.currents.style.init = function init(){
	initPicker();
	initNumParticlesSlider();
	initParticlesSpeedSlider();
	initParticlesLifeTimeSlider();
}

function initPicker(){
	$('#currentsColor').spectrum( {
		color: owgis.ncwms.currents.getColor(),
		alpha:.5,
		chooseText:"Close",
		cancelText:"",
		showAlpha:true,
		containerClassName:"colorPickerContainer",
		move: setColor
	});
}

function initParticlesLifeTimeSlider(){
	$("#particleLifeTimeSlider").slider({
		max:400,
		min:10,
		value:owgis.ncwms.currents.particles.getParticlesLifeTime(),
		change: setParticlesTimeSpeed
	});
}

function initParticlesSpeedSlider(){
	$("#particleSpeedSlider").slider({
		max:80,
		min:0.3,
		value:owgis.ncwms.currents.particles.getParticleSpeed()*100,
		change: setParticlesSpeed
	});
}

function initNumParticlesSlider(){
	$("#numParticlesSlider").slider({
		max:40000,
		min:100,
		value:owgis.ncwms.currents.particles.getNumParticles(),
		change: setNumParticles
	});
	$("#numParticles").text( owgis.ncwms.currents.particles.getNumParticles ());
}
function setParticlesSpeed(event, ui){
	owgis.ncwms.currents.particles.setParticleSpeed(ui.value/100);
}

function setParticlesTimeSpeed(event, ui){
	owgis.ncwms.currents.particles.setParticlesLifeTime(ui.value);
}
function setNumParticles(event, ui){
	$("#numParticles").text( ui.value );
	owgis.ncwms.currents.particles.setNumParticles(ui.value);
}

function setColor(color){
	owgis.ncwms.currents.setColor(color.toRgbString());
}