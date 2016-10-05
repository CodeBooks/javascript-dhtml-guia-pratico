// dragObject contains data for currently dragged element
var dragObject = {
    selectedObject : null,
    offsetX : 0,
    offsetY : 0,
    // invoked onmousedown
    engageDrag : function(evt) {
        evt = (evt) ? evt : window.event;
        dragObject.selectedObject = (evt.target) ? evt.target : evt.srcElement;
        var target = (evt.target) ? evt.target : evt.srcElement;
        var dragContainer = target;
        // in case event target is nested in draggable container
        while (target.className != "draggable" && target.parentNode) {
            target = dragContainer = target.parentNode;
        }
        // modification for pseudowindow use
        if (target.id == "titlebar") {
            target = dragContainer = target.parentNode;
        }
        if (dragContainer) {
            dragObject.selectedObject = dragContainer;
            DHTMLAPI.setZIndex(dragContainer, 100);
            dragObject.setOffsets(evt, dragContainer);
            dragObject.setDragEvents();
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
            dragObject.offsetX = evt.pageX - ((typeof dragContainer.offsetLeft == "number") ? 
                      dragContainer.offsetLeft : dragContainer.left);
            dragObject.offsetY = evt.pageY - ((typeof dragContainer.offsetTop == "number") ? 
                      dragContainer.offsetTop : dragContainer.top);
        } else if (evt.offsetX || evt.offsetY) {
            dragObject.offsetX = evt.offsetX - ((evt.offsetX < -2) ? 
                      0 : document.body.scrollLeft);
            dragObject.offsetY = evt.offsetY - ((evt.offsetY < -2) ? 
                      0 : document.body.scrollTop);
        }
    },
    // invoked onmousemove
    dragIt : function (evt) {
        evt = (evt) ? evt : window.event;
        var obj = dragObject;
        if (evt.pageX) {
            DHTMLAPI.moveTo(obj.selectedObject, (evt.pageX - obj.offsetX), 
                (evt.pageY - obj.offsetY));
        } else if (evt.clientX || evt.clientY) {
            DHTMLAPI.moveTo(obj.selectedObject, (evt.clientX - obj.offsetX), 
                (evt.clientY - obj.offsetY));
        }
        evt.cancelBubble = true;
        evt.returnValue = false;
    },
    // invoked onmouseup
    releaseDrag : function (evt) {
        DHTMLAPI.setZIndex(dragObject.selectedObject, 0);
        dragObject.clearDragEvents();
        dragObject.selectedObject = null;
    },
    // set temporary events
    setDragEvents : function () {
        addEvent(document, "mousemove", dragObject.dragIt, false);
        addEvent(document, "mouseup", dragObject.releaseDrag, false);
        // make sure nested frames react to events for Mozilla
        if (window.frames.length > 0) {
            var i, j;
            for (i = 0; i < window.frames.length; i++) {
                if (window.frames[i].frames.length == 0) {
                    addEvent(window.frames[i], "mousemove", top.dragObject.dragIt, false);
                    addEvent(window.frames[i], "mouseup", top.dragObject.releaseDrag, false);
                } else {
                    for (j = 0; j < window.frames[i].frames.length; j++) {
                        addEvent(window.frames[i].frames[j], "mousemove", top.dragObject.dragIt, false);
                        addEvent(window.frames[i].frames[j], "mouseup", top.dragObject.releaseDrag, false);
                    }
                }
            }
        }
    },
    // remove temporary events
    clearDragEvents : function () {
        removeEvent(document, "mousemove", dragObject.dragIt, false);
        removeEvent(document, "mouseup", dragObject.releaseDrag, false);
        if (window.frames.length > 0) {
            var i, j;
            for (i = 0; i < window.frames.length; i++) {
                if (window.frames[i].frames.length == 0) {
                    removeEvent(window.frames[i], "mousemove", top.dragObject.dragIt, false);
                    removeEvent(window.frames[i], "mouseup", top.dragObject.releaseDrag, false);
                } else {
                    for (j = 0; j < window.frames[i].frames.length; j++) {
                        removeEvent(window.frames[i].frames[j], "mousemove", top.dragObject.dragIt, false);
                        removeEvent(window.frames[i].frames[j], "mouseup", top.dragObject.releaseDrag, false);
                    }
                }
            }
        }
    },
    // initialize, assigning mousedown events to all
    // elements with class=ÓdraggableÓ attributes
    init : function (tagName) {
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
                addEvent(elems[i], "mousedown", dragObject.engageDrag, false);
            }
        }
    }
};
addOnLoadEvent(function() {dragObject.init("div");});