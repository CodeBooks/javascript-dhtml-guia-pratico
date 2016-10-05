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
           DATA COLLECTIONS
***********************************/
var expansionState = "1,3,10";
// constructor for outline item objects
function outlineItem(text, uri) {
    this.text = text;
    this.uri = uri;
}
var olData = {childNodes:
             [{item:new outlineItem("Forms"),
               childNodes:
                   [{item:new outlineItem("Introduction", "http://www.w3.org/TR/html401/interact/forms.html#h-17.1")},
                    {item:new outlineItem("Controls", "http://www.w3.org/TR/html401/interact/forms.html#h-17.2"),
                     childNodes:
                         [{item:new outlineItem("Control Types", "http://www.w3.org/TR/html401/interact/forms.html#h-17.2.1")}
                          ]},
                    {item:new outlineItem("FORM Element", "http://www.w3.org/TR/html401/interact/forms.html#h-17.3")},
                    {item:new outlineItem("INPUT Element", "http://www.w3.org/TR/html401/interact/forms.html#h-17.4"),
                     childNodes:
                         [{item:new outlineItem("INPUT Control Types", "http://www.w3.org/TR/html401/interact/forms.html#h-17.4.1")},
                          {item:new outlineItem("Examples", "http://www.w3.org/TR/html401/interact/forms.html#h-17.4.2")}
                          ]},
                    {item:new outlineItem("BUTTON Element", "http://www.w3.org/TR/html401/interact/forms.html#h-17.5")},
                    {item:new outlineItem("SELECT, OPTGROUP, OPTION Elements", "http://www.w3.org/TR/html401/interact/forms.html#h-17.6"),
                     childNodes:
                         [{item:new outlineItem("Pre-selected Options", "http://www.w3.org/TR/html401/interact/forms.html#h-17.6.1")}
                          ]},
                    {item:new outlineItem("TEXTAREA Element", "http://www.w3.org/TR/html401/interact/forms.html#h-17.7")},
                    {item:new outlineItem("ISINDEX Element", "http://www.w3.org/TR/html401/interact/forms.html#h-17.8")},
                    {item:new outlineItem("Labels", "http://www.w3.org/TR/html401/interact/forms.html#h-17.9"),
                     childNodes:
                         [{item:new outlineItem("LABEL Element", "http://www.w3.org/TR/html401/interact/forms.html#h-17.9.1")}
                          ]},
                    {item:new outlineItem("FIELDSET, LEGEND Elements", "http://www.w3.org/TR/html401/interact/forms.html#h-17.10")},
                    {item:new outlineItem("Element Focus", "http://www.w3.org/TR/html401/interact/forms.html#h-17.11"),
                     childNodes:
                         [{item:new outlineItem("Tabbing Navigation", "http://www.w3.org/TR/html401/interact/forms.html#h-17.11.1")},
                          {item:new outlineItem("Access Keys", "http://www.w3.org/TR/html401/interact/forms.html#h-17.11.2")}
                          ]},
                    {item:new outlineItem("Disabled and Read-Only Controls", "http://www.w3.org/TR/html401/interact/forms.html#h-17.12"),
                     childNodes:
                         [{item:new outlineItem("Disabled Controls", "http://www.w3.org/TR/html401/interact/forms.html#h-17.12.1")},
                          {item:new outlineItem("Read-Only Controls", "http://www.w3.org/TR/html401/interact/forms.html#h-17.12.2")}
                          ]},
                    {item:new outlineItem("Form Submissions", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13"),
                     childNodes:
                         [{item:new outlineItem("Form Submission Method", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.1")},
                          {item:new outlineItem("Successful Controls", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2")},
                          {item:new outlineItem("Processing Form Data", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.3"),
                           childNodes:
                               [{item:new outlineItem("1. Identify Successful Controls", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.3.1")},
                                {item:new outlineItem("2. Build Form Data Set", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.3.2")},
                                {item:new outlineItem("3. Encode Form Data", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.3.3")},
                                {item:new outlineItem("4. Submit Encoded Data", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.3.4")}
                                ]},
                          {item:new outlineItem("Form Content Types", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4"),
                           childNodes:
                               [{item:new outlineItem("application/x-www-form-urlencoded", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.1")},
                                {item:new outlineItem("multipart/form-data", "http://www.w3.org/TR/html401/interact/forms.html#h-17.13.4.2")}
                                ]
                           }
                          ]
                       }
                    ]},
              {item:new outlineItem("Scripts"),
               childNodes:
                   [{item:new outlineItem("Introduction", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.1")},
                    {item:new outlineItem("Designing Documents for Scripts", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2"),
                     childNodes:
                         [{item:new outlineItem("SCRIPT Element", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2.1")},
                           {item:new outlineItem("Specifying the Scripting Language", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2.2"),
                           childNodes:
                               [{item:new outlineItem("Default Language", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2.2.1")},
                                {item:new outlineItem("Local Language Declaration", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2.2.2")},
                                {item:new outlineItem("References to HTML Elements", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2.2.3")}
                                ]},
                           {item:new outlineItem("Intrinsic Events", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2.3")},
                           {item:new outlineItem("Dynamic Document Modification", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.2.4")}
                          ]},
                    {item:new outlineItem("Designing for Unscriptable Clients", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.3"),
                     childNodes:
                         [{item:new outlineItem("NOSCRIPT Element", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.3.1")},
                          {item:new outlineItem("Hiding Scripts from Clients", "http://www.w3.org/TR/html401/interact/scripts.html#h-18.3.2")}
                          ]}
                   ]}
                  ]
              };
          
          


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
function calcBlockState(n) {
    // get default expansionState data
    var expandedData = (expansionState.length > 0) ? expansionState.split(",") : null;
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
function drawOutline(ol, prefix) {
    var output = "";
    var nestCount, link, nestPrefix, lastInnerNode;
    prefix = (prefix) ? prefix : "";
    for (var i = 0; i < ol.childNodes.length ; i++) {
        nestCount = (ol.childNodes[i].childNodes) ? ol.childNodes[i].childNodes.length : 0;
        output += "<div class='OLRow' id='line" + currID++ + "'>\n";
        if (nestCount > 0) {
            output += prefix;
            currState += calcBlockState(currID-1);
            if (currState.substr(currState.length-1) == "0") {
            	output += "<img id='widget" + (currID-1) + "' class='collapsible' src='" + ((i == ol.childNodes.length-1 && blockID != 0) ? expMenuWidgets.collapsedWidgetEnd.src : (blockID == 0) ? expMenuWidgets.collapsedWidgetStart.src : expMenuWidgets.collapsedWidget.src);
            } else {
            	output += "<img id='widget" + (currID-1) + "' class='collapsible' src='" + ((i == ol.childNodes.length-1 && blockID != 0) ? expMenuWidgets.expandedWidgetEnd.src : (blockID == 0) ? expMenuWidgets.expandedWidgetStart.src : expMenuWidgets.expandedWidget.src);
            }
            output += "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width;
            output += " title='Click to expand/collapse nested items.' onClick='toggle(this," + blockID + ")'>&nbsp;";
            link =  (ol.childNodes[i].item.uri) ? ol.childNodes[i].item.uri : "";
            if (link) {
                output += "<a href='" + link + "' class='itemTitle' title='" + 
                link + "' target='" + displayTarget + "'>" ;
            } else {
                output += "<a class='itemTitle' title='" + link + "'>";
            }
            output += "<span style='position:relative; top:-3px; height:11px'>" + ol.childNodes[i].item.text + "</span></a>";
            output += "<span class='OLBlock' blocknum='" + blockID + "' id='OLBlock" + blockID++ + "'>";
            nestPrefix = prefix;
            nestPrefix += (i == ol.childNodes.length - 1) ? 
                       "<img src='" + expMenuWidgets.emptySpace.src + "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width + ">" :
                       "<img src='" + expMenuWidgets.chainSpace.src + "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width + ">"
            output += drawOutline(ol.childNodes[i], nestPrefix);
            output += "</span></div>\n";
        } else {
            output += prefix;
            output += "<img id='widget" + (currID-1) + "' src='" + ((i == ol.childNodes.length - 1) ? expMenuWidgets.nodeWidgetEnd.src : expMenuWidgets.nodeWidget.src);
            output += "' height=" + expMenuWidgets.height + " width=" + expMenuWidgets.width + ">";
            link =  (ol.childNodes[i].item.uri) ? ol.childNodes[i].item.uri : "";
            if (link) {
                output += "&nbsp;<a href='" + link + "' class='itemTitle' title='" + 
                link + "' target='" + displayTarget + "'>";
            } else {
                output += "&nbsp;<a class='itemTitle' title='" + link + "'>";
            }
            output += "<span style='position:relative; top:-3px; height:11px'>" + ol.childNodes[i].item.text + "</span></a>";
            output += "</div>\n";
        }
    }
    return output;
}

/*********************************
     OUTLINE INITIALIZATIONS
**********************************/
// expand items set in expansionState var, if any
function initExpand() {
    for (var i = 0; i < currState.length; i++) {
        if (currState.charAt(i) == 1) {
            document.getElementById("OLBlock" + i).style.display = "block";
        } else {
            document.getElementById("OLBlock" + i).style.display = "none";
        }
    }
}

// initialize first time -- invoked onload
function initExpMenu(xFile) {
    // wrap whole outline HTML in a span
    var olHTML = "<span id='renderedOL'>" + drawOutline(olData) + "</span>";
    // throw HTML into 'content' div for display
    document.getElementById("content").innerHTML = olHTML;
    initExpand();
}
