/**
 * Saves all the status of the animations
 * 
 * @param {type} param
 */

goog.provide('owgis.ncwms.animation.status');

// Is the animation status it can be:
// 		none -> There is not animation or is being stopped
// 		loading -> The animation is being requested but not all of the frames have loaded
//		playing -> Animation is being played at current speed
//		pause   -> Animation paused
owgis.ncwms.animation.status.loading = "loading"; 
owgis.ncwms.animation.status.loadingplaying = "loading_playing"; 
owgis.ncwms.animation.status.playing = "playing"; 
owgis.ncwms.animation.status.none = "none"; 
owgis.ncwms.animation.status.paused = "paused"; 
owgis.ncwms.animation.status.current = owgis.ncwms.animation.status.none;
