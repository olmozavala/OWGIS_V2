/**
 * 
 */
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
	this.style = {type:"string", label:"Style", value: "", required: false, uneditable: false};
	this.selected = {type:"boolean", label:"Is Selected", value: false, required: false, uneditable: false};
	this.width = {type:"string", label:"Width", value: 512, required: true, uneditable: false};
	this.height = {type:"string", label:"Height", value: 512, required: true, uneditable: false};
	this.featureInfo = {type:"string", label:"Feature Info", value: "", required: false, uneditable: false};
	this.tiled = {type:"boolean", label:"Is Tiled", value: false, required: false, uneditable: false};
	//this.netCDF = {type:"boolean", label:"Is netCDF", value: false, required: false, uneditable: false};
	this.parentMenu = {type:"multiSelect", label:"Parent Menu(s)", value: "", required: true, uneditable: false};
	this.menuID = {type:"string", label:"Menu ID", value: "", required: true, uneditable: false};
	this.menuEN = {type:"string", label:"Menu Label", value: "", required: true, uneditable: false};
	//this.layout = {type:"string", label:"Layout", value: -180, required: true, uneditable: false};
	//this.palette = {type:"string", label:"Palette", value: "default", required: true, uneditable: false};
	this.displayTitle = {type:"boolean", label:"Display Title", value: false, required: false, uneditable: false};
	this.isVectorLayer = {type:"boolean", label:"Is vectorLayer", value: false, required: false, uneditable: false, callBackFunc: "onIsVectorLayerChange()"};
	this.cql =  {type:"string", label:"CQL", value:  "week", required: true, uneditable: false};
	this.cqlids =  {type:"string", label:"CQL IDs", value:  "week", required: true, uneditable: false};
	this.jsonp = {type:"boolean", label:"JSONP", value: false, required:  false, uneditable: false};
	this.palette = {type:"string", label:"Palette", value:  "", required: true, uneditable: false};
	this.minColor = {type:"string", label:"Min Color", value:  "-1", required: true, uneditable: false};
	this.maxColor = {type:"string", label:"Max Color", value:  "-1", required:  true, uneditable: false};
	this.max_time_range = {type:"string", label:"Max time range", value:  "", required: false, uneditable: false};
	this.aboveMaxColor = {type:"string", label:"AboveMaxColor", value:  "-1", required: false, uneditable: false};
	this.belowMinColor = {type:"string", label:"BelowMinColor", value:  "-1", required:  false, uneditable: false};
	this.overlayStreamlines = {type:"string", label:"Overlay streamlines", value: "", required:  false, uneditable: false};
        this.defParticleSpeed = {type:"string", label:"defParticleSpeed", value:  "0.3", required:  false, uneditable: false};
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
		isVectorLayer: ""
};

var vectorLayer = {
		cql: "",
		cqlids: "",
		jsonp: ""
};

var	ncWMS = {
		title: "",
		featureInfo: "",
		style: "",
		width: "",
		height: "",	
		palette: "",
		minColor: "",
		maxColor: "",
		max_time_range: "",
                aboveMaxColor: "",
                belowMinColor : "",
                overlayStreamlines : "",
                defParticleSpeed: "0.3"                
};		
		
var optionalLayer = {
		parentMenu: "",
		menuID: "",
		menuEN: "",
		selected: "",
		tiled: "",
		isVectorLayer: "",
                featureInfo: ""
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

function getLayersFromURL(){
    
    $(".loader").fadeIn("fast");
    layerUrl = $("#layerUrl").val();

    if(layerUrl.indexOf("/ncWMS") > -1){ 
	ncWMSFl = true;
    }
    
    if( !layerUrl.includes("GetCapabilities") ){
        layerUrl += "?SERVICE=WMS&request=GetCapabilities";
    }
    
    if(layerUrl !== "" && layerUrl !== null){
	//console.log(layerUrl);
        
	mainLayers = $('#mainLayers').val().split(",");
	vectorLayers = $('#vectorLayers').val().split(",");
	menuIDs = $('#menuIDs').val();
        
        //paginate items found on server
        $('#content').pagination({
            dataSource: function(done) {
                $.ajax({
                    type: 'GET',
                    url: layerUrl,
                    dataType: "xml",
                    xhrFields: {
                                withCredentials: false
                    },
                    error: function (request, status, error) {
                            console.log(request.responseText); 
                            $(".loader").fadeOut("slow");
                    },
                    success: function(response) {
                        var layers = $(response).find('Layer > Layer');
                        if( typeof layers !== "undefined" ){
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
                                for(property in commonLayerProp){
                                    var val = commonLayerProp[property];
                                    if(! (val === "" || val == 'undefined')) {
                                        defLayer[property].value = val;
                                    }
                                }
                                layerArray[i] = defLayer;
                            } 

                            layerArray = layerArray.filter(function( element ) {
                                return element !== undefined;
                            });
                            console.log(layerArray);

                            OnloadFunction();
                            $(".loader").fadeOut("slow");

                        } else {
                            //URL was not geoserver / ncwms or didnt found any Layers
                            console.log("layers not found");
                            $(".loader").fadeOut("slow");
                        }
                        done(layerArray);
                    }
                });
            },
            totalNumberLocator: function(response) {
                // you can return totalNumber by analyzing response content
                return Math.floor(Math.random() * (1000 - 100)) + 100;
            },
            pageSize: 10,
            ajax: {
                beforeSend: function() {
                            console.log('Loading data ...');
                        }
            },
            callback: function(data, pagination) {
                        // template method of yourself
                        console.log(data,pagination.pageNumber);
                        var dataHtml = '';
                        //var i = 0;
                        $.each(data, function (index, item) {
                            //i++;
                            var start = '<div class="row-fluid sortable"> <div class="box span12"> <div class="box-header" data-original-title=""> <h2><i class="halflings-icon edit"></i><span class="break"></span>Layer: '+item.name.value+'</h2> <div class="box-icon"> <a class="btn-setting halflings-icon wrench" href="#" style="font-style: italic"></a><a class= "btn-minimize halflings-icon chevron-up" href="#" style="font-style: italic"></a><a class="btn-close halflings-icon remove" href="#" style="font-style: italic"></a> </div> </div> <div class="box-content"> <form  action="" method="post" class="form-horizontal" id="layerForm'+ index +'" name="layerForm'+ index +'"> <fieldset>';
                            var fields = '';
                            for(property in commonLayerProp){
                                //if( ! (item[property]== 'undefined' || item[property]=== ""))
                                idx = index+(10*(pagination.pageNumber-1)); console.log(idx);
                                fields += getDOMForProperty(idx,item[property],property);	
                            }	
                            var end = '<div class="form-actions"> <button type="submit" class="btn btn-primary">Add to XML</button></div></fieldset></form></div></div></div>';
                            dataHtml += start + fields + end;
                        });
                        $("#data-container").html(dataHtml);
                        
                        $('select[id^="layerType"]').change(function(){	
                            onLayerTypeChange(this);
                        });

                        $('form').submit(function(event) {

                            event.preventDefault();

                            $(".loader").fadeIn("fast");
                            var id = $(this).attr('id');
                            $('input[name="server"]').val(encodeURIComponent(layerUrl));
                            //$('#result').text(JSON.stringify($('form[id="'+id+'"]').serializeObject()));
                            var json = JSON.stringify($('form[id="'+id+'"]').serializeObject());
                            //alert(json); console.log(ncWMSFl,json);
                            $.ajax({
                                    type : "POST",
                                    url : "../AddToXMLServlet",
                                    data : "ncWMS="+ncWMSFl+"&json=" + json,
                                    success: function(data){
                                        var t = JSON.parse(json);
                                        console.log("wow",t.name);
                                        let result = layerArray.filter(obj => {
                                            return obj.name.value === t.name
                                          }); console.log(result);
                                        var index = layerArray.indexOf(result);
                                        if (index > -1) {
                                          layerArray.splice(index, 1);
                                        }
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
            }
        });
        
    } else {
        //there is no URL from the user input
        console.log("please write an URL.");
        $(".loader").fadeOut("slow");
    }
}

function onLayerTypeChange(o){
    var index = $(o).attr('id').substr($(o).attr('id').length - 1);
    $("div[id=\""+$(o).attr('id')+"\"]").remove();
    var ob = new Object();
    if($(o).val()==='MainLayer'){
	ob = ncWMSFl?ncWMS:mainLayer;
    } else if($(o).val()==='OptionalLayer'){
        ob = optionalLayer;
    } else { ob = backgroundLayer; }
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
    } else {
	var f = '<div id="'+$(o).attr('id')+'">'+getDOMForObject(index,vectorLayer)+'</div>';
	$(f).insertAfter($(o).parent().parent().parent());
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
        if(propertyName=="server"){
            //type="url"
            dom ='<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls"><input class="span6 typeahead'+ (property.uneditable? ' disabled':'') +' " id="'+propertyName+ index +'" name="'+propertyName +'" type="url" value="'+encodeURIComponent(property.value)+'" '+ (property.uneditable? ' disabled':'') +' '+ (property.required? ' required':'') +'></div></div>';
            return dom;
        }
        dom ='<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls"><input class="span6 typeahead'+ (property.uneditable? ' disabled':'') +' " id="'+propertyName+ index +'" name="'+propertyName +'" type="text" value="'+property.value+'" '+ (property.uneditable? ' disabled':'') +' '+ (property.required? ' required':'') +'></div></div>';
        return dom;
    } else if (fieldType === 'boolean') {
        
        dom = '<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls">  <label class="checkbox"><input type="checkbox" id="'+propertyName+ index +'" name="'+propertyName +'" value="'+property.value+'" '+ (property.uneditable? ' disabled':'') +' '+ (property.required? ' required':'') +'></label></div>  </div>';
	
        return dom;
    } else if(fieldType === 'select' || fieldType === 'multiSelect') {
        //console.log(property);
        //var f = '<div id="'+$(o).attr('id')+'">'+getDOMForObject(index,ob)+'</div>';
        var ops = property.value.split(',');
        var selectStart= '<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls"><select id="'+propertyName+ index +'" name="'+propertyName +'" '+ (fieldType === "multiSelect"?' multiple':'') +' data-rel="chosen"'+' '+ (property.required? ' required':'') +'>';
        var options="<option selected disabled hidden value=''></option>";
        if(propertyName=="layerType" && ops.length == 1){
            var selectStart= '<div class="control-group"><label class="control-label" for="'+propertyName + index +'">'+property.label+'</label><div class="controls"><select id="'+propertyName+ index +'" name="'+propertyName +'" '+ (fieldType === "multiSelect"?' multiple':'') +' data-rel="chosen"'+' '+ (property.required? ' required':'') +' disabled>';
        }
        for(var i=0; i < ops.length; i++){
            if( propertyName=="layerType" && ops.length == 1 ){
                options = options + '<option selected>'+ ops[i] + '</option>';
            } else {
                options = options + '<option>'+ ops[i] + '</option>';
            }
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

function createLayerArrayFromJSON(layersJSON){
    console.log(layersJSON);
    for(var i=0; i<layersJSON.length; i++){
        var name =  layersJSON[i]["name"];
        //var title = layersJSON[i].title;
        var defLayer = new defaultLayer();
        commonLayerProp.name = name;
        //BoundaryBox parameters
        commonLayerProp.bboxMinLong = layersJSON[i]["bbox"]["minLong"];
        commonLayerProp.bboxMaxLong = layersJSON[i]["bbox"]["maxLong"];
        commonLayerProp.bboxMinLat = layersJSON[i]["bbox"]["minLat"];
        commonLayerProp.bboxMaxLat = layersJSON[i]["bbox"]["maxLat"];
        commonLayerProp.server = layersJSON[i]["server"];
        //var styleElement =  layersJSON[i]['style'];
        defLayer["style"].value = layersJSON[i]['style'];
        commonLayerProp.format = layersJSON[i]['format'];
        commonLayerProp.layerType = layersJSON[i].layerType;
        //console.log(layersJSON[i]['layerDisplayNames']["EN"]);
        //console.log(layersJSON[i]);
        defLayer.parentMenu.value = menuIDs;
        
        for(property in commonLayerProp){
            var val = commonLayerProp[property];
            if(! (val === "" || typeof val == 'undefined')) {
                defLayer[property].value = val;
            }
        }
        
        if(layersJSON[i]['layerType'] == "MainLayer"){
            
            for(property in mainLayer){
                var val = layersJSON[i][property];
                if(! (val === "" || typeof val == 'undefined')) {
                    defLayer[property].value = val;
                }
            }
            //if is ncwMS
            if(commonLayerProp.server.indexOf("ncWMS") > -1){
                
                for(property in ncWMS){
                   var val = layersJSON[i][property];
                   console.log(property,val);
                   if(! (val === "" || typeof val == 'undefined')) {
                       defLayer[property].value = val;
                   }
                }   
            }
            defLayer.title.value = layersJSON[i]['layerDisplayNames']["EN"];
            
        } else if(layersJSON[i]['layerType'] == "OptionalLayer"){
            for(property in optionalLayer){
                var val = layersJSON[i][property];
                if(! (val === "" || typeof val == 'undefined')) {
                    defLayer[property].value = val;
                }
            }
        } else if(layersJSON[i]['layerType'] == "BackgroundLayer"){
            for(property in backgroundLayer){
                var val = layersJSON[i][property];
                if(! (val === "" || typeof val == 'undefined')) {
                    defLayer[property].value = val;
                }
            }
        }
        
        layerArray[i] = defLayer;
    }
    console.log(layerArray);
}

function createDOM4Layers(){
    
    $(".loader").fadeIn("fast");
    
    var mlJSON = JSON.parse(mainLayersJSON.value);
    for (i = 0; i < mlJSON.length; i++) {
        mlJSON[i].layerType = 'MainLayer';
    }
    var olJSON = JSON.parse(optionalLayersJSON.value); 
    for (i = 0; i < olJSON.length; i++) {
        olJSON[i].layerType = 'OptionalLayer';
    }
    var bgJSON = JSON.parse(backgroundLayersJSON.value); console.log(bgJSON);
    for (i = 0; i < bgJSON.length; i++) {
        bgJSON[i].layerType = 'BackgroundLayer';
    }
    var finalObj = mlJSON.concat(olJSON);
    finalObj = finalObj.concat(bgJSON);
    mainLayers = $('#mainLayers').val().split(",");
    vectorLayers = $('#vectorLayers').val().split(",");
    menuIDs = $('#menuIDs').val();
    
    createLayerArrayFromJSON(finalObj);
        
    //paginate items found on server
    $('#content').pagination({
        dataSource: finalObj,
        totalNumberLocator: function(response) {
                // you can return totalNumber by analyzing response content
                return Math.floor(Math.random() * (1000 - 100)) + 100;
        },
        pageSize: 10,
        callback: function(data, pagination) {
                        // template method of yourself
                        console.log(data,pagination.pageNumber);
                        var dataHtml = '';
                        //var i = 0;
                        $.each(data, function (index, item) {
                            //i++;
                            var start = '<div class="row-fluid sortable"> <div class="box span12"> <div class="box-header" data-original-title=""> <h2><i class="halflings-icon edit"></i><span class="break"></span>Layer: '+item.name+'</h2> <div class="box-icon"> <a class="btn-setting halflings-icon wrench" href="#" style="font-style: italic"></a><a class= "btn-minimize halflings-icon chevron-up" href="#" style="font-style: italic"></a><a class="btn-close halflings-icon remove" href="#" style="font-style: italic"></a> </div> </div> <div class="box-content"> <form  action="" method="post" class="form-horizontal" id="layerForm'+ index +'" name="layerForm'+ index +'"> <fieldset>';
                            var fields = '';
                            idx = index+(10*(pagination.pageNumber-1)); //console.log(idx);
                            for(property in commonLayerProp){
                                fields += getDOMForProperty(idx,layerArray[idx][property],property);
                            }
                            if( layerArray[idx]["layerType"].value == "MainLayer" ){
                                for(property in mainLayer){
                                    if(property!="selected"){
                                        fields += getDOMForProperty(idx,layerArray[idx][property],property);	
                                    }
                                }
                            } else if( layerArray[idx]["layerType"].value == "OptionalLayer" ){
                                for(property in optionalLayer){
                                    fields += getDOMForProperty(idx,layerArray[idx][property],property);	
                                }
                            } else if( layerArray[idx]["layerType"].value == "BackgroundLayer" ){
                                for(property in backgroundLayer){
                                    fields += getDOMForProperty(idx,layerArray[idx][property],property);	
                                }
                            }
                            
                            if(layerArray[idx]["server"].value.indexOf("ncWMS") > -1){ 
                                ncWMSFl = true;
                                for(property in ncWMS){
                                    fields += getDOMForProperty(idx,layerArray[idx][property],property);	
                                }
                            }
                            	                      
                            var end = '<div class="form-actions"> <button type="submit" class="btn btn-primary">Add to XML</button></div></fieldset></form></div></div></div>';
                            dataHtml += start + fields + end;
                        });
                        
                        $("#data-container").html(dataHtml);
                        /*
                        for(var i = 0; i < 10 ; i++){
                            idx = i+(10*(pagination.pageNumber-1)); console.log(idx);
                            document.getElementById("server"+idx).value = layerArray[idx]["server"].value;
                        }
                        */
                        $('select[id^="layerType"]').change(function(){	
                            onLayerTypeChange(this);
                        });

                        $('form').submit(function(event) {

                            event.preventDefault();

                            $(".loader").fadeIn("fast");
                            var id = $(this).attr('id');
                            //$('input[name="server"]').val(encodeURIComponent(layerUrl));
                            //$('#result').text(JSON.stringify($('form[id="'+id+'"]').serializeObject()));
                            var json = JSON.stringify($('form[id="'+id+'"]').serializeObject());
                            //check if ncWMS and change ncWMSFl
                            console.log(json,JSON.parse(json).server);
                            if(JSON.parse(json)["server"].indexOf("ncWMS") > -1){
                                ncWMSFl = true;
                            } else {
                                ncWMSFl = false;
                            }
                            console.log(ncWMSFl,$('form[id="'+id+'"]'));
                            $.ajax({
                                    type : "POST",
                                    url : "../AddToXMLServlet",
                                    data : "ncWMS="+ncWMSFl+"&json=" + json,
                                    success: function(data){
                                        var t = JSON.parse(json);
                                        console.log("wow",t.name);
                                        let result = layerArray.filter(obj => {
                                            return obj.name.value === t.name
                                          }); console.log(result);
                                        var index = layerArray.indexOf(result);
                                        if (index > -1) {
                                          layerArray.splice(index, 1);
                                        }
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
                        
                        $(".loader").fadeOut("slow");
            }
    });
}


