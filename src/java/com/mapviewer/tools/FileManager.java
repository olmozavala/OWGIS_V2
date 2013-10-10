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
 * @author olmozavala
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
