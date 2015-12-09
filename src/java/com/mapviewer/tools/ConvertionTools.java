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
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormatter;
import org.joda.time.format.ISODateTimeFormat;

/**
 * This class converts different type of objects.  
 * @author Olmo Zavala Romero
 */

public class ConvertionTools {
    private static final DateTimeFormatter ISO_DATE_TIME_FORMATTER =
        ISODateTimeFormat.dateTime().withZone(DateTimeZone.UTC);

    public static String dateTimeToISO8601(DateTime dateTime)
    {
        return ISO_DATE_TIME_FORMATTER.print(dateTime);
	}
    /**
     * Converts array of any object into array of int
     * @param {Object[]} strArray Object[]
     * @return int[] 
     */
    public static int[] convertObjectArrayToIntArray(Object[] strArray){
        if(strArray==null)
            return null;
        int[] resultArray = new int[strArray.length];
        for(int i=0;i<resultArray.length;i++){
            resultArray[i] = Integer.parseInt(strArray[i].toString());
        }
        return resultArray;
    }
    
     /**
     * 
     * @param {Object[]} strArray
     * @return String []
     */
	public static String[] convertObjectArrayToStringArray(Object[] strArray){
        if(strArray==null)
            return null;
        String[] resultArray = new String[strArray.length];
        for(int i=0;i<resultArray.length;i++){
            resultArray[i] = strArray[i].toString();
        }
        return resultArray;
    }   

	/**
	 * Converts a String date into the DateTime format. The string needs
	 * the format 'yyyy-mm-dd T hh:mm:ss'
	 * @param{String} strDate
	 * @return DateTime
	 */
	public static DateTime strToDateTime(String strDateTime){
		StringTokenizer tokenizer = new StringTokenizer(strDateTime,"T");
		try {
			String strDate=  tokenizer.nextToken();
			String strTime=  tokenizer.nextToken();
			//Splitting the date
			StringTokenizer dateTokens= new StringTokenizer(strDate,"-");
			int year = Integer.parseInt(dateTokens.nextToken());
			int month = Integer.parseInt(dateTokens.nextToken());
			int day = Integer.parseInt(dateTokens.nextToken());

			//Splitting the time
			StringTokenizer timeTokens= new StringTokenizer(strTime,":");
			int hour = Integer.parseInt(timeTokens.nextToken());
			int minute= Integer.parseInt(timeTokens.nextToken());
			int second= Integer.parseInt(timeTokens.nextToken());

			return new DateTime(year,month,day, hour,minute,second, 0);
		} catch (Exception e) {
			//TODO Throw custom format exception
			System.out.println("Incorrect date format");
		}
       
		return null;
	} 
}
