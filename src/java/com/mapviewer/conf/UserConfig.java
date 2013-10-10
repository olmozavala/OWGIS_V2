/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mapviewer.conf;

/**
 * This class contains the specific configuration of the user for the map he or
 * she is viewing, for example if he drags a window then this class will record
 * that for each active user.
 *
 * @author olmozavala
 */
public class UserConfig {

    private String center = null;
    private String zoom = null;
    private String palette = null;
    private String mainMenuParent = "default";//dragabble windows
    private String palettes_div = "default";//dragabble windows
    private String palettePos = "default";//dragabble windows
    private String optionalMenuParent = "default";//dragabble windows
    private String CalendarsAndStopContainer = "default";//dragabble windows
    private String helpInstructions = "default";
    private String mainMenuMinimize = "default";
    private String calendarsMinimize = "default";
    private String optionalsMinimize = "default";

    /**
     * In this constructor the variables are initialized from the default values
     * of the OpenLayers class
     *
     * @param opConfig
     */
    public UserConfig(OpenLayerMapConfig opConfig) {
        center = opConfig.getCenter();
        zoom = opConfig.getCenter();

    }

    /**
     * This constructor simple initializes the two variables of the class
     *
     * @param{String} center
     * @param{String} zoom
     * @param{String} palette
     */
    public UserConfig(String center, String zoom, String palette) {
        this.center = center;
        this.zoom = zoom;
        this.palette = palette;
    }

    public String get_helpInstructions() {
        return helpInstructions;
    }

    public String get_palettes_div() {
        return palettes_div;
    }

    public String get_palettePos() {
        return palettePos;
    }

    public String get_optionalMenuParent() {
        return optionalMenuParent;
    }

    public String get_CalendarsAndStopContainer() {
        return CalendarsAndStopContainer;
    }

    public String get_mainMenuParent() {
        return mainMenuParent;
    }

    public String get_mainMenuMinimize() {
        return mainMenuMinimize;
    }

    public String get_calendarsMinimize() {
        return calendarsMinimize;
    }

    public String get_optionalsMinimize() {
        return optionalsMinimize;
    }

    /**
     * Set the positions of the different variables of this class, this is
     * called by UserRequestManager this refers to the draggable windows that
     * the user can move.
     *
     * @param{String} mainMenuParent
     * @param{String} palettes_div
     * @param{String} palettePos
     * @param{String} optionalMenuParent
     * @param{String} CalendarsAndStopContainer
     * @param{String} helpInstructions
     * @param{String} mainMenuMinimize
     * @param{String} calendarsMinimize
     * @param{String} optionalsMinimize
     */
    public void setPositions(String mainMenuParent, String palettes_div, String palettePos, String optionalMenuParent, String CalendarsAndStopContainer, String helpInstructions, String mainMenuMinimize, String calendarsMinimize, String optionalsMinimize) {
        this.mainMenuParent = mainMenuParent;
        this.palettes_div = palettes_div;
        this.palettePos = palettePos;
        this.optionalMenuParent = optionalMenuParent;
        this.CalendarsAndStopContainer = CalendarsAndStopContainer;
        this.helpInstructions = helpInstructions;
        this.mainMenuMinimize = mainMenuMinimize;
        this.calendarsMinimize = calendarsMinimize;
        this.optionalsMinimize = optionalsMinimize;


    }

    public String getCenter() {
        return center;
    }

    public void setCenter(String center) {
        this.center = center;
    }

    public String getZoom() {
        return zoom;
    }

    public void setZoom(String zoom) {
        this.zoom = zoom;
    }

    public String getPalette() {
        return palette;
    }

    public void setPalette(String palette) {
        this.palette = palette;
    }

    /**
     * construct JSON object to record the positions of the windows that the
     * user drags.
     *
     */
    public String getJSONObject() {
        String jsonText = "{";

        jsonText += "'" + "mainMenuParent" + "':'" + mainMenuParent + "','"
                + "palettes_div" + "':'" + palettes_div + "','"
                + "palettePos" + "':'" + palettePos + "','"
                + "optionalMenuParent" + "':'" + optionalMenuParent + "','"
                + "CalendarsAndStopContainer" + "':'" + CalendarsAndStopContainer + "','"
                + "helpInstructions" + "':'" + helpInstructions + "','"
                + "mapCenter" + "':'" + center + "','"
                + "mainMenuMinimize" + "':'" + mainMenuMinimize + "','"
                + "calendarsMinimize" + "':'" + calendarsMinimize + "','"
                + "optionalsMinimize" + "':'" + optionalsMinimize + "'";

        jsonText += "}";

        return jsonText;
    }
}
