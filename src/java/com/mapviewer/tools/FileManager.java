/*
* Copyright (c) 2013 Olmo Zavala
* Permission is hereby granted, free of charge, to any person obtaining a copy of 
* this software and associated documentation files (the "Software"), to deal in the 
* Software without restriction, including without limitation the rights to use, copy, 
* modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
* to permit persons to whom the Software is furnished to do so, subject to the following conditions: 
* The above copyright notice and this permission notice shall be included in all copies or substantial 
* portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mapviewer.tools;

import com.mapviewer.exceptions.XMLFilesException;
import java.io.File;
import java.util.Date;

/**
 *This class searches the folders for files
 * @author Olmo Zavala-Romero
 */
public class FileManager {

	/**
	 * It obtains the number of files for an specific folder. 
	 * @param {String} folder path
	 * @return int Number of files for that folder
	 */
	public static int numberOfFilesInFolder(String folder){
		File searchFolder = new File(folder);

		File[] files = searchFolder.listFiles(new xmlFileFilter());
		return files.length;
	}
	/**
	 * Searches the list of files inside a folder. 
	 * @param folder
	 * @return String[] List of files inside the folder. 
	 */
	public static String[] filesInFolder(String folder) throws XMLFilesException {
		File searchFolder = new File(folder);

		File[] files = searchFolder.listFiles(new xmlFileFilter());
		String[] xmlFiles = new String[files.length];
		int idx = 0;
		for (File currFile: files) {
			xmlFiles[idx] = currFile.getAbsolutePath();
			idx++;
		}

		if(idx == 0){//No file was found
			throw new XMLFilesException("There is no XML files for the layers configuration"
					+ " at: " + folder +" !!!");
		}
		return xmlFiles;
	}

	/**
	 * Retrieves the last date a file has been modified. 
	 * @param fileName
	 * @return Date Last modification.
	 */
	public static Date lastModification(String fileName){
		File file = new File(fileName);
		return new Date(file.lastModified());
	}

}
