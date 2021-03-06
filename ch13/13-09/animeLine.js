// animation object holds numerous properties related to motion
var anime;

// initialize default anime object
function initAnime() {
    anime = {elemID:"", 
             xCurr:0, 
             yCurr:0, 
             xTarg:0, 
             yTarg:0, 
             xStep:0, 
             yStep:0,
             xDelta:0,
             yDelta:0,
             xTravel:0,
             yTravel:0,
             vel:1, 
             pathLen:1, 
             interval:null
            };
}

// stuff animation object with necessary explicit and calculated values
function initSLAnime(elemID, startX, startY, endX, endY, speed) {
    initAnime();
    anime.elemID = elemID;
    anime.xCurr = startX;
    anime.yCurr = startY;
    anime.xTarg = endX;
    anime.yTarg = endY;
    anime.xDelta = Math.abs(endX - startX);
    anime.yDelta = Math.abs(endY - startY);
    anime.vel = (speed) ? speed : 1;
    // set element's start position
    document.getElementById(elemID).style.left = startX + "px";
    document.getElementById(elemID).style.top = startY + "px";
    // the length of the line between start and end points
    anime.pathLen = Math.sqrt((Math.pow((startX - endX), 2)) + 
    (Math.pow((startY - endY), 2)));
    // how big the pixel steps are along each axis
    anime.xStep = parseInt(((anime.xTarg - anime.xCurr) / anime.pathLen) * anime.vel);
    anime.yStep = parseInt(((anime.yTarg - anime.yCurr) / anime.pathLen) * anime.vel);
    // start the repeated invocation of the animation
    anime.interval = setInterval("doSLAnimation()", 10);
}

// calculate next steps and assign to style properties
function doSLAnimation() {
    if ((anime.xTravel + anime.xStep) <= anime.xDelta && 
        (anime.yTravel + anime.yStep) <= anime.yDelta) {
        var x = anime.xCurr + anime.xStep;
        var y = anime.yCurr + anime.yStep;
        document.getElementById(anime.elemID).style.left = x + "px";
        document.getElementById(anime.elemID).style.top = y + "px";
        anime.xTravel += Math.abs(anime.xStep);
        anime.yTravel += Math.abs(anime.yStep);
        anime.xCurr = x;
        anime.yCurr = y;
    } else {
        document.getElementById(anime.elemID).style.left = anime.xTarg + "px";
        document.getElementById(anime.elemID).style.top = anime.yTarg + "px";
        clearInterval(anime.interval);
    }
}

addOnLoadEvent(initAnime);