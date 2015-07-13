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
package com.mapviewer.tools;

import java.util.StringTokenizer;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * This class is used to manipulate the arrays of the numbers and the strings and do transformations
 * between these type of data. 

 * @author Olmo Zavala Romero
 */
public class StringAndNumbers {
	/**
	 * Removes the spaces of a string plus many special characters.
	 * @param original
	 * @return 
	 */
	public static String removeSpaceAndSpecialChars(String original){
		String newStr = original.replaceAll("[^a-zA-Z0-9]+", "");

		return newStr;
	}
	
    /**
     * Add quotations to a string. 
     
     * @param original String 
     * @return String 
     */
    public static String attachCuotes(String original){
        String withCuotes = "'"+original+"'";
        return withCuotes;
    }    
	/**
         * Gets a an array of strings and converts it into a chain separated by commas. 
	* @param arreglo
	* @return String 
	*/
    public static String arrregloSeparadoPorComas(String [] arreglo){
        String resultado=null;//string with comma separeted stuff. 
        
        for(int i=0;i<arreglo.length;i++){
            if(i==0)
                resultado=arreglo[i];
            else
                resultado+=","+arreglo[i];
        }
        return resultado;
    }
    /**
     * Obtain the array of doubles from an array of strings. 
     
     * @param array String[] Arreglo de cadenas con valores numericos validos
     * @return double[] Arreglo de dobles qeu contiene los valores del arreglo de entrada
     */
    public static double[] doubleArrayFromStrArray(String[] array){
        double[] valores = null;
        try {
            valores = new double[array.length];
            for(int i=0;i<valores.length;i++){
                valores[i]= (new Double(array[i])).doubleValue();
            }
        } catch (Exception e) {
            System.out.print("Error making cast to double in com.mapviewer.tools.StringAndNumbers.strArrayTodoubleArray");
            return null;
        }
        return valores;
    }
    /**
     * Look for a specific interger value. 
     * @param array int[] array to look for the data
     * @param value int target int to look for
     * @return boolean true is found false otherwise. 
     */
    public static boolean intArrayContains(int[] array, int value){        
        if(array==null)
            return false;
        for(int i=0;i<array.length;i++){
            if(value==array[i])
                return true;
        }
        return false;
    }
    /**
     * Obtains an array of strings from a string comma separated. 
     
     * @param stringColonSeparated String comma separated string
     * @return String[] 
     */
    public static String[] strArrayFromStringColon(String stringColonSeparated){
        if(stringColonSeparated==null)//in case a string is empty
            return null;
        StringTokenizer tokenizer = new StringTokenizer(stringColonSeparated,",");
        String[] strings = new String[tokenizer.countTokens()];
        int cont=0;
        while(tokenizer.hasMoreElements()){
            strings[cont] =  tokenizer.nextToken();
            cont++;
        }
        return strings;
    }

	/**
	 * Validates if a string is numeric.
	 */
	public static boolean isNumeric(String text){
		Pattern p = Pattern.compile("-?[0-9]*.?[0-9]+");
		Matcher m = p.matcher(text);
		return m.matches();
	}
}
