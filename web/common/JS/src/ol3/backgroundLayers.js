goog.provide('owgis.backlayers');

var backLayer;
var origBackLayer;
var firstTime = true;//First time the background layer is modified by the user

owgis.backlayers.update = function(type){
	switch(type){
		case "bluemarble":
			blueMarble();
			break;

		case "mapquest":
			mapquest();
			break;
	}
}

function mapquest(){
	backLayer =  new ol.layer.Tile({
			source: new ol.source.MapQuest({
				layer: 'sat'
			})});

	var allLayers = map.getLayers();
	
	if(firstTime){
		origBackLayer = allLayers.removeAt(0);
		firstTime = false;
		allLayers.insertAt(0,backLayer);
	}
}

function blueMarble(){
	console.log("Updating background layer to blue marble from NASA");
	var projection = ol.proj.get('EPSG:4326');
	var projectionExtent = projection.getExtent();
	
	var attribution = new ol.Attribution({
		html: "<a href='https://earthdata.nasa.gov/gibs'>NASA EOSDIS GIBS</a>," +
			"<a href='http://owgis.org'> OWGIS </a>" 
	});
	
	var resolutions = [0.5625, 0.28125, 0.140625, 0.0703125, 0.03515625, 0.017578125, 0.0087890625, 0.00439453125];
	var matrixIds = [0, 1, 2, 3, 4, 5, 6, 7];
	
	var tempSource = new ol.source.WMTS({
		attributions: [attribution],
		url: 'http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi',
		layer: "BlueMarble_NextGeneration",
		matrixSet: "EPSG4326_500m",
		format: "image/jpeg",
		projection: projection,
		tileGrid: new ol.tilegrid.WMTS({
                origin: ol.extent.getTopLeft(projectionExtent),
			resolutions: resolutions,
			matrixIds: matrixIds,
			tileSize: 512
		}),
		//extent: nasa_layers[i].extent,
		extent: projectionExtent,
		style: ''
	});
	
	var allLayers = map.getLayers();
	backLayer =  new ol.layer.Tile({source: tempSource});
	
	if(firstTime){
		origBackLayer = allLayers.removeAt(0);
		firstTime = false;
		allLayers.insertAt(0,backLayer);
	}
	
}

/**
 * This function updates the background from the dropdown menu and refreshes the website.  
 * @returns {undefined}
 */
owgis.backlayers.change = function(){             
    MapViewersubmitForm();
}

/**
 * This function create a background layers menu
 */
owgis.backlayers.buildselection = function buildDropDownBackLayers(){
    //Obtains the available backgroundlayers
    var backLayers = mapConfig.availableBackgroundLayers.split(";");
    var backLayerNames = mapConfig.availableBackgroundNames.split(";");
    var sel = $("#backLayersDropDown");
    
    if(!sel || !sel[0]) {
       return;
    }
    //Iterates ver all the available backgroundlayers
    for(var i = 0; i < backLayers.length; i++){
	//Creates a new option
        var str = _map_bk_layer === backLayers[i] ? "selected" : "";
        //var op = $("<option data-icon=\"glyphicon glyphicon-globe\" value=\""+backLayers[i]+"\" "+str+">"+backLayerNames[i]+"</option>");
        if(mobile){
            var op = $("<option value=\""+backLayers[i]+"\" "+str+">"+backLayerNames[i]+"</option>");
        }else{
            var op = $("<option data-content=\"<img src='common/images/backlayers/"+backLayers[i]+".png'></span><span style='display:inline-block; width:10%;'></span>\" value=\""+backLayers[i]+"\" "+str+">"+backLayerNames[i]+"</option>");
        }
        
        sel[0].options.add(op[0]);        
        
    }
    
    sel[0].addEventListener("change", function() {
        owgis.backlayers.change(this.options[this.selectedIndex].value);        
    });
    
    var span = sel.parent().find("span");
    if(span[0]) {
        span.text(sel[0].options[sel[0].selectedIndex].text);
    }
    
}


//owgis.backlayers.buildselection = function buildDropDownBackLayers(){
//    var backLayers = mapConfig.availableBackgroundLayers.split(";");
//    var backLayerNames = mapConfig.availableBackgroundNames.split(";");
//    var sel = $("#backLayersDropDown");      
//    
//    console.log(_map_bk_layer);
//    
//    if(!sel || !sel[0]){
//        return;
//    }
//    
//    for(i=0; i< backLayers.length; i++){
//        
//        var img = $("<img>");
//        img.attr('src','https://www.shareicon.net/data/32x32/2015/10/07/113964_media_512x512.png');
//        var langText = ""+backLayers[i]+""        
//        if(backLayers[i] == _map_bk_layer){
//            $("#backLayersDropDown").html("");
//            //$("#backLayersDropDown").append(img);
//            //$("#backLayersDropDown").append(langText);
//            $("#backLayersDropDown").append("<span class='caret'></span>");
//        }else{
//            var li = $("<li>");
//            var link = $("<a value=\""+backLayers[i]+"\"></a>");
//            //console.log("<a href='#' onclick='owgis.backlayers.change(\'"+backLayers[i]+"\')'></a>");              
//            link.on('click',function(){
//                owgis.backlayers.change(this.text);
//                $("backLayers").val(this.text);
//                console.log('funcion')
//            })
//            link.append(img);
//            link.append(langText);
//            li.append(link);
//            $("#langDropDownLayers").append(li);
//        }
//        var span = sel.parent().find("span");
//        if(span[0]) {
//            span.text(backLayers[i]);
//        }
//    }
//}