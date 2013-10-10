/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mapviewer.exceptions;

/**
 * This Exception should be used for everything related with the
 * improper generation of the XML files. 
 * @author olmozavala
 */
public class XMLFilesException extends MapViewerException{

	public XMLFilesException() {
	}

	public XMLFilesException(String message) {
		super(message);
	}
	
}
