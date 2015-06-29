goog.provide('owgis.ncwms.currents.style')

goog.require('owgis.ncwms.currents.particles')

var minNumParticles = 100;
var maxNumParticles = 40000;
var maxParticleSpeed = 80;
var minParticleSpeed = .3;
var maxParticleLifeTime = 400;
var minParticleLifeTime = 10;

owgis.ncwms.currents.style.togglestyling = function toggleWindow(){
	$("#currentsControlsContainer").toggle();
}

owgis.ncwms.currents.style.reset = function reset(){

	if(!mobile){
		$("#numParticlesSlider").uislider("option","value",
		owgis.ncwms.currents.particles.getDefaultNumberOfParticles() );

		$("#particleSpeedSlider").uislider("option","value",
		owgis.ncwms.currents.particles.getCurrentResolutionParticleSpeed() );
		
		$("#particleLifeTimeSlider").uislider("option","value",
		owgis.ncwms.currents.particles.getDefaultParticlesLifeTime());
		
	}else{
		$("#numParticlesSlider")
				.prop("value", owgis.ncwms.currents.particles.getDefaultNumberOfParticles() ); 
		$("#numParticlesSlider").slider('refresh');
		owgis.ncwms.currents.particles.setNumParticles(
			owgis.ncwms.currents.particles.getDefaultNumberOfParticles() ); 

		$("#particleSpeedSlider")
				.prop("value", owgis.ncwms.currents.particles.getCurrentResolutionParticleSpeed() ); 
		$("#particleSpeedSlider").slider('refresh');

		$("#particleLifeTimeSlider")
				.prop("value", owgis.ncwms.currents.particles.getDefaultParticlesLifeTime());
		$("#particleLifeTimeSlider").slider('refresh');
		owgis.ncwms.currents.particles.setParticlesLifeTime(
			owgis.ncwms.currents.particles.getDefaultParticlesLifeTime() ); 
	}
	
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
	if(!mobile){
		$("#particleLifeTimeSlider").uislider({
			max:maxParticleLifeTime,
			min:minParticleLifeTime,
			value:owgis.ncwms.currents.particles.getParticlesLifeTime(),
			change: setParticlesTimeSpeed
		});
	}else{
		$("#particleLifeTimeSlider")
				.addClass("ui-hidden-accessible")
				.prop("max",maxParticleLifeTime)
				.prop("min",minParticleLifeTime)
				.prop("value", owgis.ncwms.currents.particles.getParticlesLifeTime());
		
		$("#particleLifeTimeSlider").slider('refresh');
		$("#particleLifeTimeSlider").on('change', setParticlesTimeSpeedMobile);
	}
}

function initParticlesSpeedSlider(){
	if(!mobile){
		$("#particleSpeedSlider").uislider({
			max:maxParticleSpeed,
			min:minParticleSpeed,
			value:owgis.ncwms.currents.particles.getParticleSpeed()*100,
			change: setParticlesSpeed
		});
	}else{
		$("#particleSpeedSlider")
				.addClass("ui-hidden-accessible")
				.prop("min",minParticleSpeed)
				.prop("max",maxParticleSpeed)
				.prop("value",owgis.ncwms.currents.particles.getParticleSpeed()*100);
		
		
		$("#particleSpeedSlider").slider('refresh');
		$("#particleSpeedSlider").on('change', setParticlesSpeedMobile);
	}
}

function initNumParticlesSlider(){
	if(!mobile){
		$("#numParticlesSlider").slider({
			max:maxNumParticles,
			min:minNumParticles,
			value:owgis.ncwms.currents.particles.getNumParticles(),
			change: setNumParticles
		});
		$("#numParticles").text( owgis.ncwms.currents.particles.getNumParticles());
	}else{
		$("#numParticlesSlider")
				.prop("min",minNumParticles)
				.prop("max",maxNumParticles)
				.prop("value",owgis.ncwms.currents.particles.getNumParticles());
		
		$("#numParticlesSlider").slider('refresh');
		$("#numParticlesSlider").on('change', setNumParticlesMobile);
	}
}

function setParticlesSpeed(event, ui){
	owgis.ncwms.currents.particles.setParticleSpeed(ui.value/100);
}

function setParticlesSpeedMobile(event){
	var value = event.currentTarget.value;
	owgis.ncwms.currents.particles.setParticleSpeed(value/100);
}

function setParticlesTimeSpeed(event, ui){
	owgis.ncwms.currents.particles.setParticlesLifeTime(ui.value);
}

function setParticlesTimeSpeedMobile(event){
	var value = event.currentTarget.value;
	owgis.ncwms.currents.particles.setParticlesLifeTime(value);
}

function setNumParticles(event, ui){
	$("#numParticles").text( ui.value );
	owgis.ncwms.currents.particles.setNumParticles(ui.value);
}

function setNumParticlesMobile(event){
	var value = event.currentTarget.value;
	owgis.ncwms.currents.particles.setNumParticles(value);
}

function setColor(color){
	owgis.ncwms.currents.setColor(color.toRgbString());
}