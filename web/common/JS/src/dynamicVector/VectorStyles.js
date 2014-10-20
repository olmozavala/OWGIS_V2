goog.provide('owgis.vector.styles');

// General styles for default vector layer
var strokeColor = "blue";//Default color for the stroke
var fillColor = "rgba(255, 255, 0, 0.1)"; // Default fill color
var defaultWidth = 1;

var pointImageDef = new ol.style.Circle({
	radius: 2,
	fill: new ol.style.Fill({color: strokeColor}),
	stroke: null
});

// General styles for highlight vector layer
var strokeColorH = "red";//Default color for the stroke
var fillColorH = "rgba(255, 0, 0, 0.1)"; // Default fill color
var defaultWidthH = 1;

var pointImageHighlight = new ol.style.Circle({
	radius: 2,
	fill: new ol.style.Fill({color: strokeColorH}),
	stroke: null
});

//---------------------- Default styles -------------
owgis.vector.styles.def = {
    'Point': [new ol.style.Style({
			image: pointImageDef
		})],
    'LineString': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: defaultWidth
			})
		})],
    'MultiLineString': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: defaultWidth
			})
		})],
    'MultiPoint': [new ol.style.Style({
			image: pointImageDef
		})],
    'MultiPolygon': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: defaultWidth
			}),
			fill: new ol.style.Fill({
				color: fillColor
			})
		})],
    'Polygon': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				lineDash: [4],
				width: defaultWidth 
			}),
			fill: new ol.style.Fill({
				color: fillColor
			})
		})],
    'GeometryCollection': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: defaultWidth 
			}),
			fill: new ol.style.Fill({
				color: fillColor
			}),
			image: pointImageDef
		})],
    'Circle': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColor,
				width: defaultWidth 
			}),
			fill: new ol.style.Fill({
				color: fillColor
			})
		})]
};
//------------------------------ Highlight styles -----------

owgis.vector.styles.highlight= {
    'Point': [new ol.style.Style({
			image: pointImageHighlight
		})],
    'LineString': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColorH,
				width: defaultWidthH
			})
		})],
    'MultiLineString': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColorH,
				width: defaultWidthH
			})
		})],
    'MultiPoint': [new ol.style.Style({
			image: pointImageHighlight
		})],
    'MultiPolygon': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColorH,
				width: defaultWidthH
			}),
			fill: new ol.style.Fill({
				color: fillColorH
			})
		})],
    'Polygon': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColorH,
				lineDash: [4],
				width: defaultWidthH 
			}),
			fill: new ol.style.Fill({
				color: fillColorH
			})
		})],
    'GeometryCollection': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColorH,
				width: defaultWidthH 
			}),
			fill: new ol.style.Fill({
				color: fillColorH
			}),
			image: pointImageHighlight
		})],
    'Circle': [new ol.style.Style({
			stroke: new ol.style.Stroke({
				color: strokeColorH,
				width: defaultWidthH 
			}),
			fill: new ol.style.Fill({
				color: fillColorH
			})
		})]
};
