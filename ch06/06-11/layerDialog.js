// Help choose from four UI pseudo-window flavors
function getCurrOSUI() {
    var ua = navigator.userAgent;
    if (ua.indexOf("Mac") != -1) {
        if (ua.indexOf("OS X") != -1 || ua.indexOf("MSIE 5.2") != -1) {
            return "macosX";
        } else {
            return "win9x";
        }
    } else if (ua.indexOf("Windows XP") != -1 || ua.indexOf("NT 5.1") != -1) {
        return "winxp";
    } else if ((document.compatMode && document.compatMode != "BackComp") || 
        (navigator.product && navigator.product == "Gecko")) {
        // Win9x and CSS-compatible
        return "win9x";
    } else {
        // default for Windows 9x in quirks mode, Unix/Linux, & unknowns
        return "win9xQ";
    }
}
var currOS = getCurrOSUI();
// Load OS-specific style sheet for pseudo dialog layer
document.write("<link rel='stylesheet' type='text/css' href='dialogLayer_" + currOS + ".css'>");

//******************************
//  BEGIN LAYER DIALOG CODE
//******************************/
// Requires DHTML3API.js library pre-loaded
// One object tracks the current pseudo-window layer.
var dialogLayer = {
    layer : null,
    visible : false,
    // Center a positionable element whose name is passed as 
    // a parameter in the current window/frame, and show it
    centerOnWindow : function(elemID) {
        // 'obj' is the positionable object
        var obj = DHTMLAPI.getRawObject(elemID);
        // window scroll factors
        var scrollX = 0, scrollY = 0;
        if (document.body && typeof document.body.scrollTop != "undefined") {
            scrollX += document.body.scrollLeft;
            scrollY += document.body.scrollTop;
            if (document.body.parentNode && 
                typeof document.body.parentNode.scrollTop != "undefined") {
                scrollX += document.body.parentNode.scrollLeft;
                scrollY += document.body.parentNode.scrollTop
            }
        } else if (typeof window.pageXOffset != "undefined") {
            scrollX += window.pageXOffset;
            scrollY += window.pageYOffset;
        }
        var x = Math.round((DHTMLAPI.getInsideWindowWidth()/2) - 
            (DHTMLAPI.getElementWidth(obj)/2)) + scrollX;
        var y = Math.round((DHTMLAPI.getInsideWindowHeight()/2) - 
            (DHTMLAPI.getElementHeight(obj)/2)) + scrollY;
        DHTMLAPI.moveTo(obj, x, y);
    },
    initLayerDialog : function() {
        document.getElementById("closebox").src = "closeBox_" + currOS + ".jpg";
        dialogLayer.layer = document.getElementById("pseudoWindow");
    },
    // Set up and display pseudo-window.
    // Parameters:
    //    url -- URL of the page/frameset to be loaded into iframe
    //    returnFunc -- reference to the function (on this page)
    //                  that is to act on the data returned from the dialog
    //    args -- [optional] any data you need to pass to the dialog
    openLayerDialog : function(url, title, returnFunc, args) {
        if (!this.visible) {
            // Initialize properties of the modal dialog object.
            this.url = url;
            this.title = title;
            this.returnFunc = returnFunc;
            this.args = args;
            this.returnedValue = "";
            
            // Load URL
            document.getElementById("contentFrame").src = url;
            
            // Set title of "window"
            document.getElementById("barTitle").firstChild.nodeValue = title;
            
            // Center "window" in browser window or frame
            this.layer.style.visibility = "hidden";
            this.layer.style.display = "block"
            this.centerOnWindow("pseudoWindow");
            
            // Show it and set visibility flag
            this.layer.style.visibility = "visible"
            this.visible = true;
         }
    },
    closeLayerDialog : function() {
        this.layer.style.display = "none"
        this.visible = false;
    }
};

addOnLoadEvent(dialogLayer.initLayerDialog);

//**************************
//  END LAYER DIALOG CODE
//**************************/
