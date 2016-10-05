// slideObject contains data for currently dragged element
var slideObject = {
    selectedObject : null,
    offsetX : 0,
    offsetY : 0,
    sliders : new Array(),
    zone: null,
    updateFunction: null,
    // invoked onmousedown
    engageDrag : function(evt, i) {
        evt = (evt) ? evt : window.event;
        slideObject.selectedObject = (evt.target) ? evt.target : evt.srcElement;
        var target = (evt.target) ? evt.target : evt.srcElement;
        var dragContainer = target;
        // in case event target is nested in draggable container
        while (target.className != "draggable" && target.parentNode) {
            target = dragContainer = target.parentNode;
        }
        if (dragContainer) {
            slideObject.selectedObject = dragContainer;
            slideObject.setOffsets(evt, dragContainer);
            slideObject.setDragEvents();
            for (var i = 0; i < slideObject.sliders.length; i++) {
                if (slideObject.sliders[i].id == target.id) {
                    break;
                }
            }
            slideObject.zone = slideObject.sliders[i].zone;
            slideObject.updateFunction = slideObject.sliders[i].updateFunction;
            evt.cancelBubble = true;
            evt.returnValue = false;
            if (evt.stopPropagation) {
                evt.stopPropagation();
                evt.preventDefault();
            }
        }
        return false;
    },
    // calculate offset of mousedown within draggable element
    setOffsets : function (evt, dragContainer) {
        if (evt.pageX) {
            slideObject.offsetX = evt.pageX - ((typeof dragContainer.offsetLeft == "number") ? 
                      dragContainer.offsetLeft : dragContainer.left);
            slideObject.offsetY = evt.pageY - ((typeof dragContainer.offsetTop == "number") ? 
                      dragContainer.offsetTop : dragContainer.top);
        } else if (evt.offsetX || evt.offsetY) {
            slideObject.offsetX = evt.clientX - ((typeof dragContainer.offsetLeft == "number") ? 
                      dragContainer.offsetLeft : 0);
            slideObject.offsetY = evt.clientY - ((typeof dragContainer.offsetTop == "number") ? 
                      dragContainer.offsetTop : 0);
        }
    },
    // invoked onmousemove
    dragIt : function (evt) {
        evt = (evt) ? evt : window.event;
        var x, y, width, height;
        var obj = slideObject;
        if (evt.pageX) {
            x = evt.pageX - obj.offsetX;
            y = evt.pageY - obj.offsetY;
        } else if (evt.clientX || evt.clientY) {
            x = evt.clientX - obj.offsetX;
            y = evt.clientY - obj.offsetY;
        }
        width = DHTMLAPI.getElementWidth(obj.selectedObj);
        height = DHTMLAPI.getElementHeight(obj.selectedObj);
        x = (x < obj.zone.left) ? obj.zone.left : 
           ((x + width > obj.zone.right) ? obj.zone.right - width : x);
        y = (y < obj.zone.top) ? obj.zone.top : 
           ((y + height > obj.zone.bottom) ? obj.zone.bottom - height : y);
        DHTMLAPI.moveTo(obj.selectedObject, x, y);
        // optimized for horizontal slider
        if (obj.updateFunction) obj.updateFunction((x - obj.zone.left)/(obj.zone.right - obj.zone.left));
        evt.cancelBubble = true;
        evt.returnValue = false;
    },
    // invoked onmouseup
    releaseDrag : function (evt) {
        DHTMLAPI.setZIndex(slideObject.selectedObject, 0);
        slideObject.clearDragEvents();
        slideObject.selectedObject = null;
    },
    // set temporary events
    setDragEvents : function () {
        addEvent(document, "mousemove", slideObject.dragIt, false);
        addEvent(document, "mouseup", slideObject.releaseDrag, false);
    },
    // remove temporary events
    clearDragEvents : function () {
        removeEvent(document, "mousemove", slideObject.dragIt, false);
        removeEvent(document, "mouseup", slideObject.releaseDrag, false);
    },
    // add slider data to sliders array
    // data in object form {zone obj, updateFuncRef}
    addSlide : function(data) {
        this.sliders[this.sliders.length] = data;
    },
    // initialize, assigning mousedown events to all
    // elements with class="draggable" attributes
    init : function () {
        var elems = [];
        if (document.all) {
            // IE 5 & 5.5 don't know wildcard for getElementsByTagName
            // so use document.body.all, which lets IE 4 work OK
            elems = document.body.all;
        } else if (document.body && document.body.getElementsByTagName) {
            elems = document.body.getElementsByTagName("*");
        }
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].className.match(/draggable/)) {
                addEvent(elems[i], "mousedown", function(evt) {slideObject.engageDrag(evt)}, false);
            }
        }
    }
};
// set onload event via eventsManager.js
addOnLoadEvent(slideObject.init);
