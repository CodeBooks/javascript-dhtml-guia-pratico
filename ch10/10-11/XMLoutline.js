/**********************************
          GLOBAL VARIABLES
***********************************/
var expMenuWidgets = {
    height : 16,
    width : 20,
    collapsedWidget : {src : "oplus.gif"},
    collapsedWidgetStart : {src : "oplusStart.gif"},
    collapsedWidgetEnd : {src : "oplusEnd.gif"},
    expandedWidget : {src : "ominus.gif"},
    expandedWidgetStart : {src : "ominusStart.gif"},
    expandedWidgetEnd : {src : "ominusEnd.gif"},
    nodeWidget : {src : "onode.gif"},
    nodeWidgetEnd : {src : "onodeEnd.gif"},
    emptySpace : {src : "oempty.gif"},
    chainSpace : {src : "ochain.gif"},
    preloadImages : function() {
        var img = new Image(this.height, this.width);
        img.src = this.collapsedWidget.src;
        img.src = this.collapsedWidgetStart.src;
        img.src = this.collapsedWidgetEnd.src;
        img.src = this.expandedWidget.src;
        img.src = this.expandedWidgetStart.src;
        img.src = this.expandedWidgetEnd.src;
        img.src = this.nodeWidget.src;
        img.src = this.nodeWidgetEnd.src;
        img.src = this.emptySpace.src;
        img.src = this.chainSpace.src;
    }
}
expMenuWidgets.preloadImages();

// miscellaneous globals
var currState = "";
var displayTarget = "contentFrame";

/**********************************
  TOGGLE DISPLAY AND ICONS
***********************************/
// invert item state (expanded to/from collapsed)
function swapState(currState, currVal, n) {
    var newState = currState.substring(0,n);
    newState += currVal ^ 1 // Bitwise XOR item n;
    newState += currState.substring(n+1,currState.length);
    return newState;
}

// retrieve matching version of 'minus' images
function getExpandedWidgetState(imgURL) {
    if (imgURL.indexOf("Start") != -1) {
        return expMenuWidgets.expandedWidgetStart.src;
    }
    if (imgURL.indexOf("End") != -1) {
        return expMenuWidgets.expandedWidgetEnd.src;
    }
    return expMenuWidgets.expandedWidget.src;
}

// retrieve matching version of 'plus' images
function getCollapsedWidgetState(imgURL) {
    if (imgURL.indexOf("Start") != -1) {
        return expMenuWidgets.collapsedWidgetStart.src;
    }
    if (imgURL.indexOf("End") != -1) {
        return expMenuWidgets.collapsedWidgetEnd.src;
    }
    return expMenuWidgets.collapsedWidget.src;
}

// toggle an outline mother entry, storing new state value;
// invoked by onclick event handlers of widget image elements
function toggle(img, blockNum) {
    var newString = "";
    var expanded, n;
    // modify state string based on parameters from IMG
    expanded = currState.charAt(blockNum);
    currState = swapState(currState, expanded, blockNum);
    // dynamically change display style
    if (expanded == "0") {
        document.getElementById("OLBlock" + blockNum).style.display = "block";
        img.src = getExpandedWidgetState(img.src);
    } else {
        document.getElementById("OLBlock" + blockNum).style.display = "none";
        img.src = getCollapsedWidgetState(img.src);
    }
}

function expandAll() {
    var newState = "";
    while (newState.length < currState.length) {
        newState += "1";
    }
    currState = newState;
    var contentImages = document.getElementById("content").getElementsByTagName("img");
    var widgetNum, expanded;
    for (var i = 0; i < contentImages.length; i++) {
        if (contentImages[i].className == "collapsible") {
            widgetNum = contentImages[i].id.substring(6);
            contentImages[i].src = getExpandedWidgetState(contentImages[i].src);
        }
    }
    initExpand();
}

function collapseAll() {
    var newState = "";
    while (newState.length < currState.length) {
        newState += "0";
    }
    currState = newState;
    var contentImages = document.getElementById("content").getElementsByTagName("img");
    var widgetNum, expanded;
    for (var i = 0; i < contentImages.length; i++) {
        if (contentImages[i].className == "collapsible") {
            widgetNum = contentImages[i].id.substring(6);
            contentImages[i].src = getCollapsedWidgetState(contentImages[i].src);
        }
    }
    initExpand();
}

/*********************************
   OUTLINE HTML GENERATION
**********************************/
// apply default expansion state from outline's header
// info to the expanded state for one element to help 
// initialize currState variable
function calcBlockState(ol, n, expandElem) {
    // get OPML expansionState data
    var expandedData = (expandElem && expandElem.childNodes.length) ? expandElem.firstChild.nodeValue.split(",") : null;
    if (expandedData) {
        for (var j = 0; j < expandedData.length; j++) {
            if (n == expandedData[j] - 1) {
                return "1";
            }
        }
    }
    return "0";
}

// counters for reflexive calls to drawOutline()
var currID = 0;
var blockID = 0;
// generate HTML for outline
function drawOutline(ol, prefix, expState) {
    var output = "";
    var nestCount, link, nestPrefix, lastInnerNode;
    prefix = (prefix) ? prefix : "";
    if (ol.childNodes[ol.childNodes.length - 1].nodeType == 3) {
        ol.removeChild(ol.childNodes[ol.childNodes.length - 1]);
    }
    for (var i = 0; i < ol.childNodes.length ; i++) {
        if (ol.childNodes[i].nodeType == 3) {
            continue;
        }
        if (ol.childNodes[i].childNodes.length > 0 && ol.childNodes[i].childNodes[ol.childNodes[i].childNodes.length - 1].nodeType == 3) {
             ol.childNodes[i].removeChild(ol.childNodes[i].childNodes[ol.childNodes[i].childNodes.length - 1]);
        }
        nestCount = ol.childNodes[i].childNodes.length;
        output += "<div class='OLRow' id='line" + currID++ + "'>\n";
        if (nestCount > 0) {
            output += prefix;
            currState += calcBlockState(ol, currID-1, expState);
            if (currState.substr(currState.length-1) == "0") {
                output += "<img id='widget" + (currID-1) + "' class='collapsible' src='" + ((i == ol.childNodes.length-1 && blockID != 0) ? expMenuWidgets.collapsedWidgetEnd.src : (blockID == 0) ? expMenuWidgets.collapsedWidgetStart.src : expMenuWidgets.collapsedWidget.src);
            } else {
                output += "<img id='widget" + (currID-1) + "' class='collapsible' src='" + ((i == ol.childNodes.length-1 && blockID != 0) ? expMenuWidgets.expandedWidgetEnd.src : (blockID == 0) ? expMenuWidgets.expandedWidgetStart.src : expMenuWidgets.expandedWidget.src);
            }
            output += "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width;
            output += " title='Click to expand/collapse nested items.' onClick='toggle(this," + blockID + ")'>&nbsp;";
            link =  (ol.childNodes[i].getAttribute("uri")) ? ol.childNodes[i].getAttribute("uri") : "";
            if (link) {
                output += "<a href='" + link + "' class='itemTitle' title='" + 
                link + "' target='" + displayTarget + "'>" ;
            } else {
                output += "<a class='itemTitle' title='" + link + "'>";
            }
            output += "<span style='position:relative; top:-3px; height:11px'>" + ol.childNodes[i].getAttribute("text") + "</span></a>";
            output += "<span class='OLBlock' blocknum='" + blockID + "' id='OLBlock" + blockID++ + "'>";
            nestPrefix = prefix;
            nestPrefix += (i == ol.childNodes.length - 1) ? 
                       "<img src='" + expMenuWidgets.emptySpace.src + "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width + ">" :
                       "<img src='" + expMenuWidgets.chainSpace.src + "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width + ">"
            output += drawOutline(ol.childNodes[i], nestPrefix, expState);
            output += "</span></div>\n";
        } else {
            output += prefix;
            output += "<img id='widget" + (currID-1) + "' src='" + ((i == ol.childNodes.length - 1) ? expMenuWidgets.nodeWidgetEnd.src : expMenuWidgets.nodeWidget.src);
            output += "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width + ">";
            link =  (ol.childNodes[i].getAttribute("uri")) ? ol.childNodes[i].getAttribute("uri") : "";
            if (link) {
                output += "&nbsp;<a href='" + link + "' class='itemTitle' title='" + 
                link + "' target='" + displayTarget + "'>";
            } else {
                output += "&nbsp;<a class='itemTitle' title='" + link + "'>";
            }
            output +="<span style='position:relative; top:-3px; height:11px'>" +  ol.childNodes[i].getAttribute("text") + "</span></a>";
            output += "</div>\n";
        }
    }
    return output;
}

/*********************************
     OUTLINE INITIALIZATIONS
**********************************/
// expand items set in expansionState OPML tag, if any
function initExpand() {
    for (var i = 0; i < currState.length; i++) {
        if (currState.charAt(i) == 1) {
            document.getElementById("OLBlock" + i).style.display = "block";
        } else {
            document.getElementById("OLBlock" + i).style.display = "none";
        }
    }
}

function insertOutline(req) {
    req = req.request;
    if (req.readyState == 4 && req.status == 200) {
        // get outline body elements for iteration and conversion to HTML
        var ol = req.responseXML.getElementsByTagName("body")[0];
        // wrap whole outline HTML in a span
        var olHTML = "<span id='renderedOL'>" + drawOutline(ol, "", req.responseXML.getElementsByTagName("expansionState")[0]) + "</span>";
        // throw HTML into 'content' div for display
        document.getElementById("content").innerHTML = olHTML;
        initExpand();
    }
}

// constructor function for an XML request object;
function XMLDoc() {
    var me = this;
    var req = null;
    // branch for native XMLHttpRequest object
    if(window.XMLHttpRequest) {
        try {
            req = new XMLHttpRequest();
        } catch(e) {
            req = null;
        }
    // branch for IE/Windows ActiveX version
    } else if(window.ActiveXObject) {
        try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
        } catch(e) {
            try {
               req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(e) {
               req = null;
            }
        }
    } else {
            alert("This example requires a browser with XML support, such as IE5+/Windows, Mozilla, Safari 1.2, or Opera 8.")
    }
    // preserve reference to request object for later
    this.request = req;
    // "public" method to be invoked whenever
    this.loadXMLDoc = function(url, loadHandler) {
        if(this.request) {
            this.request.open("GET", url, true);
            this.request.onreadystatechange = function () {loadHandler(me)};
            this.request.setRequestHeader("Content-Type", "text/xml");
            this.request.send("");
        }
    };
}

function initXML() {
    var outlineRequest = new XMLDoc();
    outlineRequest.loadXMLDoc("SpecOutline.xml", insertOutline);
}

addOnLoadEvent(initXML);
