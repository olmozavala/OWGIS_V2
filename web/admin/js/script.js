/**
 * 
 */
//$( document ).ready(function() {

//});
window.onload = function() {
	$(".loader").fadeOut("slow");

};

var layerArray = [];
var mainLayers = [];
var vectorLayers = [];
var menuIDs = [];
var ncWMSFl = false;
var layerUrl;

$.fn.serializeObject = function()
{
    var o = {};
    this.find(':input:disabled').removeAttr('disabled');
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;                                
};

function defaultLayer() {
	this.name = {type:"string", label:"Layer Name", value: "", required: true, uneditable: true};
	this.bboxMinLong = {type:"string", label:"BBOX West Bound Longitude", value: "-180", required: true, uneditable: false};
	this.bboxMaxLong = {type:"string", label:"BBOX East Bound Longitude", value: "90", required: true, uneditable: false};
	this.bboxMinLat = {type:"string", label:"BBOX South Bound Latitude", value: "-90", required: true, uneditable: false};
	this.bboxMaxLat =  {type:"string", label:"BBOX North Bound Latitude", value: "180", required: true, uneditable: false};
	this.server = {type:"string", label:"Server", value: "", required: true, uneditable: true};
	this.format = {type:"string", label:"Format", value: "image/jpeg", required: true, uneditable: false};
	this.proj = {type:"string", label:"Projection", value:  "EPSG:4326", required: true, uneditable: false};
	this.layerType = {type:"select", label:"Layer Type", value:  "MainLayer, OptionalLayer, BackgroundLayer", required: true, uneditable: false, callBackFunc: "onLayerTypeChange()"};

	this.title = {type:"string", label:"Title", value:  "EPSG:4326", required: true, uneditable: false};
	this.style = {type:"string", label:"Style", value: "", required: true, uneditable: false};
	this.selected = {type:"boolean", label:"Is Selected", value: false, required: false, uneditable: false};
	this.width = {type:"string", label:"Width", value: 512, required: true, uneditable: false};
	this.height = {type:"string", label:"Height", value: 512, required: true, uneditable: false};
	this.featureInfo = {type:"string", label:"Feature Info", value: "", required: true, uneditable: false};
	this.tiled = {type:"boolean", label:"Is Tiled", value: false, required: false, uneditable: false};
	this.netCDF = {type:"boolean", label:"Is netCDF", value: false, required: false, uneditable: false};
	this.parentMenu = {type:"multiSelect", label:"Parent Menu(s)", value: "", required: true, uneditable: false};
	this.menuID = {type:"string", label:"Menu ID", value: "", required: true, uneditable: false};
	this.menuEN = {type:"string", label:"Menu Label", value: "", required: true, uneditable: false};
	this.layout = {type:"string", label:"Layout", value: -180, required: true, uneditable: false};
	//this.palette = {type:"string", label:"Palette", value: "default", required: true, uneditable: false};
	this.displayTitle = {type:"boolean", label:"Display Title", value: false, required: false, uneditable: false};
		
	//this.jsonp = {type:"boolean", label:"JSONP", value: false, required: true, uneditable: false};
	this.isVectorLayer = {type:"boolean", label:"Is vectorLayer", value: false, required: false, uneditable: false, callBackFunc: "onIsVectorLayerChange()"};
	this.cql =  {type:"string", label:"CQL", value:  "week", required: true, uneditable: false};
	this.cqlids =  {type:"string", label:"CQL IDs", value:  "week", required: true, uneditable: false};
	this.jsonp = {type:"boolean", label:"JSONP", value: false, required:  false, uneditable: false};
	
	this.palette = {type:"string", label:"Palette", value:  "", required: true, uneditable: false};
	this.minColor = {type:"string", label:"Min Color", value:  "-1", required: true, uneditable: false};
	this.maxColor = {type:"string", label:"Max Color", value:  "-1", required:  true, uneditable: false};
	this.max_time_range = {type:"string", label:"Max time range", value:  "", required: true, uneditable: false};
	};


var commonLayerProp = {
		name: "",
		server: "",
		bboxMinLong: "",
		bboxMaxLong: "",
		bboxMinLat:"",
		bboxMaxLat: "", 
		proj: "",
		format:"",
		layerType: ""
};

var mainLayer = {
		title: "",
		tiled: "",
		featureInfo: "",
		style: "",
		parentMenu: "",
		menuID: "",
		menuEN: "",
		width: "",
		height: "",
		isVectorLayer: ""
};

var vectorLayer = {
		cql: "",
		cqlids: "",
		jsonp: "",
};

var	ncWMS = {
		title: "",
		tiled: "",
		featureInfo: "",
		style: "",
		parentMenu: "",
		menuID: "",
		menuEN: "",
		width: "",
		height: "",	
		palette: "",
		minColor: "",
		maxColor: "",
		max_time_range: ""
};		
		
var optionalLayer = {
		parentMenu: "",
		menuID: "",
		menuEN: "",
		selected: "",
		tiled: "",
		isVectorLayer: ""
};

var backgroundLayer = {
		tiled: "",
		style: "",
		featureInfo: ""	
};


var indexOf = function(needle) {
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                if(this[i] === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, needle);
};

function getGeoServerLayers(){
	$(".loader").fadeIn("fast");
	layerUrl = $("#layerUrl").val();
	var url = 'xml/wms2.xml';
	if(layerUrl.indexOf("/ncWMS") > -1){
		//alert('ncWMS');
		//url = 'xml/ncwms2.xml';
		ncWMSFl = true;
	}
	console.log(layerUrl);
	mainLayers = $('#mainLayers').val().split(",");
	vectorLayers = $('#vectorLayers').val().split(",");
	menuIDs = $('#menuIDs').val();
	$.ajax({
		type: "GET",
		//url: 'xml/wms2.xml',
		//url:  'http://132.248.8.238:8080/geoserver/wms?SERVICE=WMS&request=GetCapabilities',
		url: layerUrl,
		dataType: "xml",
			xhrFields: {
			    withCredentials: false
			  }
	}).then(function(response) {
            var layers = $(response).find('Layer > Layer');
            console.log(response);
            for(var i=0; i<layers.size(); i++){
		var name =  $(layers[i]).children('Name').text();
		var title = $(layers[i]).children('Title').text();
		var defLayer = new defaultLayer();
						
		//check if layer already there in XML, if exists then don't display
		if((indexOf.call(mainLayers, name) > -1) || (indexOf.call(vectorLayers, name) > -1)) continue;			

			
		commonLayerProp.name = name;
		//BoundaryBox parameters
		commonLayerProp.bboxMinLong = $(layers[i]).children('EX_GeographicBoundingBox').children('westBoundLongitude').text();
		commonLayerProp.bboxMaxLong = $(layers[i]).children('EX_GeographicBoundingBox').children('eastBoundLongitude').text();
		commonLayerProp.bboxMinLat = $(layers[i]).children('EX_GeographicBoundingBox').children('southBoundLatitude').text();
		commonLayerProp.bboxMaxLat = $(layers[i]).children('EX_GeographicBoundingBox').children('northBoundLatitude').text();
		commonLayerProp.server = layerUrl;
		var styleElement =  $(layers[i]).children('Style');

		commonLayerProp.format = styleElement.find('Format').text();
		commonLayerProp.layerType = "";
		defLayer.title.value = title;
		defLayer.parentMenu.value = menuIDs;
		layerArray[i] = defLayer;
		var start = '<div class="row-fluid sortable"> <div class="box span12"> <div class="box-header" data-original-title=""> <h2><i class="halflings-icon edit"></i><span class="break"></span>Layer: '+name+'</h2> <div class="box-icon"> <a class="btn-setting halflings-icon wrench" href="#" style="font-style: italic"></a><a class= "btn-minimize halflings-icon chevron-up" href="#" style="font-style: italic"></a><a class="btn-close halflings-icon remove" href="#" style="font-style: italic"></a> </div> </div> <div class="box-content"> <form  action="" method="post" class="form-horizontal" id="layerForm'+ i +'" name="layerForm'+ i +'"> <fieldset>';
			
		var fields = '';
		for(property in commonLayerProp){
                    var val = commonLayerProp[property];
                    if(! (val === "" || val == 'undefined')) {
			defLayer[property].value = val;
                    }				
                    fields = fields + getDOMForProperty(i,defLayer[property],property);	
		}			
		var end = '<div class="form-actions"> <button type="submit" class="btn btn-primary">Add to XML</button></div></fieldset></form></div></div></div>';
                //$(".geoServerContent").append('<div class="row-fluid sortable"> <div class="box span12"> <div class="box-header" data-original-title=""> <h2><i class="halflings-icon edit"></i><span class="break"></span>Layer: '+title+'</h2> <div class="box-icon"> <a class="btn-setting halflings-icon wrench" href="#" style="font-style: italic"></a><a class= "btn-minimize halflings-icon chevron-up" href="#" style="font-style: italic"></a><a class="btn-close halflings-icon remove" href="#" style="font-style: italic"></a> </div> </div> <div class="box-content"> <form class="form-horizontal" id="layerForm'+ i +'" name="layerForm'+ i +'"> <fieldset> <div class="control-group"> <label class="control-label" for="layerName'+ i +'">Layer Name</label> <div class="controls"> <input class="span6 typeahead" id="layerName'+ i +'" type="text" value="'+layerName+'"> </div> </div> <div class="control-group"> <label class="control-label" for="layerTitle'+ i +'">Layer Title</label> <div class="controls"> <input class="span6 typeahead" id="layerTitle'+ i +'" type="text" value="'+title+'"> </div> </div> <div class="control-group"> <label class="control-label" for="westBound'+ i +'">West Bound Longitude</label> <div class="controls"> <input class="span6 typeahead" id="westBound'+ i +'" type="text" value="'+westBound+'"> </div> </div> <div class="control-group"> <label class="control-label" for="eastBound'+ i +'">East Bound Longitude</label> <div class="controls"> <input class="span6 typeahead" id="eastBound'+ i +'" type="text" value="'+eastBound+'"> </div> </div> <div class="control-group"> <label class="control-label" for="southBound'+ i +'">South Bound Latitude</label> <div class="controls"> <input class="span6 typeahead" id="southBound'+ i +'" type="text" value="'+southBound+'"> </div> </div> <div class="control-group"> <label class="control-label" for="northBound'+ i +'">North Bound Latitude</label> <div class="controls"> <input class="span6 typeahead" id="northBound'+ i +'" type="text" value="'+northBound+'"> </div> </div> <div class="form-actions"> <button class="btn btn-primary" type="submit">Add to XML</button> <button class="btn" type="reset">Cancel</button> </div> </fieldset> </form> </div> </div> </div>');
		$(".geoServerContent").append(start + fields + end);
            }  
            console.log(layers);
            OnloadFunction();
            $('select[id^="layerType"]').change(function(){	
                onLayerTypeChange(this);
            });
            $(".loader").fadeOut("slow");
                
	    $('form').submit(function(event) {
                
                event.preventDefault();
                
	    	$(".loader").fadeIn("fast");
	        var id = $(this).attr('id');
	        $('input[name="server"]').val(encodeURIComponent(layerUrl));
//	        $('#result').text(JSON.stringify($('form[id="'+id+'"]').serializeObject()));
	        var json = JSON.stringify($('form[id="'+id+'"]').serializeObject());
	        //alert(json);
	        console.log(ncWMSFl,json);
	        $.ajax({
	    		type : "POST",
	    		url : "../AddToXMLServlet",
	    		data : "ncWMS="+ncWMSFl+"&json=" + json,
	    		success: function(data){
                            console.log("wow");
	    			$(".loader").fadeOut("slow");
	    			var formParent = $('form[id="'+id+'"]').parent();
                                $('form[id="'+id+'"]').remove();
                                formParent.parent()
                                        .parent()
                                        .addClass('animated zoomOutLeft')
                                        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                                        $(this).remove();
                                });
	    		}
	    	});	
	        
	        return false;
	    });
	});
}



function onLayerTypeChange(o){
	var index = $(o).attr('id').substr($(o).attr('id').length - 1);
	$("div[id=\""+$(o).attr('id')+"\"]").remove();
	var ob = new Object();
	if($(o).val()==='MainLayer'){
		ob = ncWMSFl?ncWMS:mainLayer;
	}
	else if($(o).val()==='OptionalLayer'){
		ob = optionalLayer;
	}
	else ob = backgroundLayer;
	var f = '<div id="'+$(o).attr('id')+'">'+getDOMForObject(index,ob)+'</div>';
	$(f).insertAfter($(o).parent().parent());
	$('[data-rel="chosen"],[rel="chosen"]').chosen();
	$('input[id^="isVectorLayer"]').change(function(){	
		onIsVectorLayerChange(this);
	});
	$('input[type="checkbox"]').change(function(){
	     cb = $(this);
	     cb.val(cb.prop('checked'));
	 });
}

function onIsVectorLayerChange(o){
	var index = $(o).attr('id').substr($(o).attr('id').length - 1);
	if(!$(o).prop('checked')){
		$("div[id=\""+$(o).attr('id')+"\"]").remove();
	}
	else{
	var f = '<div id="'+$(o).attr('id')+'">'+getDOMForObject(index,vectorLayer)+'</div>';
	$(f).insertAfter($(o).parent().parent().parent());
//	$('input[id^="isVectorLayer"]').change(function(){	
//		onIsVectorLayerChange(this);
//	});
	$('input[type="checkbox"]').change(function(){
	     cb = $(this);
	     cb.val(cb.prop('checked'));
	 });
}
}

function getDOMForObject(index,object){
	var currentLayer = layerArray[index];
	var fields = '';
	for(curProperty in object){
		var val = object[curProperty];
		if(! (val === "" || val == 'undefined')) {
			currentLayer[curProperty].value = val;
		}				
		fields = fields + getDOMForProperty(index,currentLayer[curProperty],curProperty);	
	}
	return fields;
	
}

function getDOMForProperty(index,property,propertyName){
	var fieldType = property.type;
	var dom = '';
	if(fieldType === 'string'){
		dom ='<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls"><input class="span6 typeahead'+ (property.uneditable? ' disabled':'') +' " id="'+propertyName+ index +'" name="'+propertyName +'" type="text" value="'+property.value+'" '+ (property.uneditable? ' disabled':'') +' '+ (property.required? ' required':'') +'></div></div>';
		return dom;
	}
	else if (fieldType === 'boolean') {
		dom = '<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls">  <label class="checkbox"><input type="checkbox" id="'+propertyName+ index +'" name="'+propertyName +'" value="'+property.value+'" '+ (property.uneditable? ' disabled':'') +' '+ (property.required? ' required':'') +'></label></div>  </div>';
		return dom;
	}
	else if(fieldType === 'select' || fieldType === 'multiSelect') {
		var selectStart= '<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls"><select id="'+propertyName+ index +'" name="'+propertyName +'" '+ (fieldType === "multiSelect"?' multiple':'') +' data-rel="chosen"'+' '+ (property.required? ' required':'') +'>';
		var options="<option selected disabled hidden value=''></option>";
		var ops = property.value.split(',');
		for(var i=0; i < ops.length; i++){
			options = options + '<option>'+ ops[i] + '</option>';
		}
		var selectEnd = ' </select></div></div>';
		dom = selectStart + options + selectEnd;
		return dom;
	}
	else return;
}

function downloadMobileApp(){
	$(".loader").fadeIn("fast");
	var url = $("#mobileSiteUrl").val();
	
	$.ajax({
		type : "POST",
		url : "../MobileServlet",
		data : "url=" + url,
		success: function(data){
			$(".loader").fadeOut("slow");
			var qrcode = new QRCode("qrcode");
			qrcode.makeCode(data);
			$('#qrcode-control').css('display','block');
			window.open(data,'_self');
		}
	});	
}


//$(function() {
//    $('form').submit(function() {
//        var id = $(this).attr('id');
////        $('#result').text(JSON.stringify($('form[id="'+id+'"]').serializeObject()));
//        alert(JSON.stringify($('form[id="'+id+'"]').serializeObject()));
//        return false;
//    });
//});