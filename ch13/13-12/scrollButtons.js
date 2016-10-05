var scrollEngaged = false;
var scrollInterval;
var scrollBars = new Array();

function scrollBar(ownerID, ownerContentID, upID, dnID) {
    this.ownerID = ownerID;
    this.ownerContentID = ownerContentID;
    this.index = scrollBars.length;
    this.upButton = document.getElementById(upID);
    this.dnButton = document.getElementById(dnID);
    this.upButton.index = this.index;
    this.dnButton.index = this.index;
    
    this.ownerHeight = parseInt(DHTMLAPI.getComputedStyle(this.ownerID, "height"));

    this.contentElem = document.getElementById(ownerContentID);
    this.contentFontSize = parseInt(DHTMLAPI.getComputedStyle(this.ownerContentID, 
        "font-size"));
    this.contentScrollHeight = (this.contentElem.scrollHeight) ? 
        this.contentElem.scrollHeight : this.contentElem.offsetHeight;
    setScrollEvents(this.upButton, this.dnButton);
}

function setScrollEvents(upButton, dnButton) {
    addEvent(upButton, "mousedown", handleScrollClick, false);
    addEvent(upButton, "mouseup", handleScrollStop, false);
    addEvent(upButton, "contextmenu", blockEvent, false);
    
    addEvent(dnButton, "mousedown", handleScrollClick, false);
    addEvent(dnButton, "mouseup", handleScrollStop, false);
    addEvent(dnButton, "contextmenu", blockEvent, false);
}

function handleScrollStop() {
    scrollEngaged = false;
}

function blockEvent(evt) {
    evt = (evt) ? evt : event;
    evt.cancelBubble = true;
    return false;
}

function handleScrollClick(evt) {
    var fontSize;
    evt = (evt) ? evt : event;
    var target = (evt.target) ? evt.target : evt.srcElement;
    var index = target.index;
    fontSize = scrollBars[index].contentFontSize;
    fontSize = (target.className == "lineup") ? fontSize : -fontSize;
    scrollEngaged = true;
    scrollBy(index, parseInt(fontSize));
    scrollInterval = setInterval("scrollBy(" + index + ", " + 
        parseInt(fontSize) + ")", 100);
    evt.cancelBubble = true;
    return false;
}

function scrollBy(index, px) {
    var scroller = scrollBars[index];
    var elem = document.getElementById(scroller.ownerContentID);
    var top = parseInt(DHTMLAPI.getComputedStyle(elem, "top"));
    var scrollHeight = parseInt(scroller.contentScrollHeight);
    var height = scroller.ownerHeight;
    if (scrollEngaged && top + px >= -scrollHeight + height && top + px <= 0) {
        DHTMLAPI.moveBy(elem, 0, px);
    } else {
        clearInterval(scrollInterval);
    }
}
