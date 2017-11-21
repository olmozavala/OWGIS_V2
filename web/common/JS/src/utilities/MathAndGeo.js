goog.provide('owgis.utilities.mathgeo');

/**
 * This method computes the angle between two vectors in spherical
 * coordinates with magnitude 1 and the values are in degrees 
 * @param {type} a
 * @param {type} b
 * @returns {undefined}
 */
owgis.utilities.mathgeo.anglebetweenspherical = function (a, b){

  	var A =  owgis.utilities.mathgeo.spheretocartdeg( a[0], a[1]);
  	var B =  owgis.utilities.mathgeo.spheretocartdeg( b[0], b[1]);

	var anglerad =  Math.acos(owgis.utilities.mathgeo.dot(A,B));
	var angladeg = owgis.utilities.mathgeo.radtodeg(anglerad);
	
	//console.log("A("+a[0]+","+a[1]+") B("+b[0]+","+b[1]+")");
	//console.log("Final angle is: "+  angladeg);
	return angladeg;
}

/**
 * This function computes the dot product of two vectors of any dimension
 * @param {type} a
 * @param {type} b
 * @returns {Number}
 */
owgis.utilities.mathgeo.dot = function (a, b){
	var res = 0;

	if(a.length !== b.length){
		console.log("The sizes of the vectors is not the same");
		return -1;
	}

	var dim  = a.length;
	for(var i = 0; i < dim; i++){
		res += a[i]*b[i];
	}

	return res;
}

/**
 * This function computes the cross product of two vectors of d = 3
 * @param {type} a
 * @param {type} b
 * @returns {Number}
 */
owgis.utilities.mathgeo.cross = function (a, b){
	var res = 0;

	if(a.length !== 3 ||  b.length !== 3){
		console.log("The sizes of the vectors is not 3");
		return -1;
	}

	res = [ a[1]*b[2] - a[2]*b[1], 
			a[2]*b[0] - a[0]*b[2],
			a[0]*b[1] - a[1]*b[0] ] ;

	return res;
}

/**
 * This function transforms sphere coordinates into 3D cartesian coordinates
 * Assuming it is in radiansTime
 */
owgis.utilities.mathgeo.spheretocart = function (lon, lat){
	var res = [Math.sin(lon)*Math.cos(lat),
			   Math.sin(lat),
		   		Math.cos(lon)*Math.cos(lat)];

	return res;
}

/**
 * This function transforms sphere coordinates into 3D cartesian coordinates.
 * Assumes the input and output are in degrees.
 */
owgis.utilities.mathgeo.spheretocartdeg = function (lon, lat){
	lat = owgis.utilities.mathgeo.degtorad(lat);//Changes lat from deg to radians
	lon = owgis.utilities.mathgeo.degtorad(lon);//Changes lon from deg to radians

	var res =  owgis.utilities.mathgeo.spheretocart(lon,lat);

	return res;
}

/**
 * This function transforms 3D cartesian coordinates into spherical coordinates 
 */
owgis.utilities.mathgeo.carttosphere = function (x,y,z){
	var res = [Math.atan(y/x),
				Math.atan( Math.sqrt(Math.pow(x,2) + Math.pow(y,2))/z )];
	return res;
}

/**
 * This function transforms 3D cartesian coordinates into spherical coordinates 
 * and assumes the input is degrees and the output also
 */
owgis.utilities.mathgeo.carttospheredeg = function (x,y,z){
	var lon = Math.atan( Math.sqrt(Math.pow(x,2) + Math.pow(y,2))/z);
	var lat = Math.atan(y/x);
	return owgis.utilities.mathgeo.radtodeg([lon,lat]);
}

/**
 * This function transforms all the values of a vector from radians to degrees 
 * @param {type} a
 * @returns {undefined}
 */
owgis.utilities.mathgeo.radtodeg= function (a){
	var res = new Array();
	if(a.length){
		for(var i = 0; i < a.length; i++){
			res[i] = a[i]*(180 / Math.PI);
		}
	}else{
		res = a*(180 / Math.PI);
	}
	return res;
}

/**
 * This function transforms all the values of a vector from degrees to radians 
 * @param {type} a
 * @returns {undefined}
 */
owgis.utilities.mathgeo.degtorad= function (a){
	var res = new Array();
	if(a.length){
		for(var i = 0; i < a.length; i++){
			res[i] = Math.PI*a[i]/180 ;
		}
	}else{
		res = Math.PI*a/180;
	}
	return res;
}

/**
 * Flips the vector direction 
 * @param {type} a
 * @returns {undefined}
 */
owgis.utilities.mathgeo.flipVect = function (a){
	var res = new Array();
	for(var i = 0; i < a.length; i++){
		res[i] = -1*a[i];
	}
	return res;
}