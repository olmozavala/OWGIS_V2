/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mapviewer.tools;

import java.io.File;
import java.io.FileFilter;

/**
 *
 * @author olmozavala
 */
public class xmlFileFilter implements FileFilter{

	@Override
	public boolean accept(File pathname) {
		if(pathname.getName().endsWith(".xml"))
			return true;
		else
			return false;
	}
	
	
}
