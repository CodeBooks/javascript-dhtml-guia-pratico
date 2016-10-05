var cMenuMgr = {
    // position and display context menu
    showContextMenu : function(evt) {
        this.hideContextMenus();
        evt = (evt) ? evt : ((event) ? event : null);
        if (evt) {
            var elem = (evt.target) ? evt.target : evt.srcElement;
             if (elem.nodeType == 3) {
                elem = elem.parentNode;
            }
            if (elem.className == "contextEntryLive") {
                var menu = document.getElementById(cMenu[elem.id].menuID);
                // turn on IE mouse capture
                if (menu.setCapture) {
                    menu.setCapture();
                }
                // position menu at mouse event location
                var coords = this.getPageEventCoords(evt);
                menu.style.left = coords.left + "px";
                menu.style.top = coords.top + "px";
                menu.style.visibility = "visible";
                if (evt.preventDefault) {
                    evt.preventDefault();
                }
                evt.returnValue = false;
            }
        }
    },
    // hide all context menus
    hideContextMenus : function() {
        if (document.releaseCapture) {
            // turn off IE mouse event capture
            document.releaseCapture();
        }
        for (var i in cMenu) {
            var menu = document.getElementById(cMenu[i].menuID)
            menu.style.visibility = "hidden";
        }
    },
    // rollover highlights of context menu items
    toggleHighlight : function(evt) {
        evt = (evt) ? evt : ((event) ? event : null);
        if (evt) {
            var elem = (evt.target) ? evt.target : evt.srcElement;
            if (elem.nodeType == 3) {
                elem = elem.parentNode;
            }
            if (elem.className.indexOf("menuItem") != -1) {
                elem.className = (evt.type == "mouseover") ? "menuItemOn" : "menuItem";
            }
        }
    },
    // navigate to chosen menu item
    execMenu : function(evt) {
        evt = (evt) ? evt : ((event) ? event : null);
        if (evt) {
            var elem = (evt.target) ? evt.target : evt.srcElement;
            if (elem.nodeType == 3) {
                elem = elem.parentNode;
            }
            if (elem.className == "menuItemOn") {
                location.href = this.getHref(elem);
            }
            this.hideContextMenus();
        }
    },
    // retrieve URL from cMenu object related to chosen item
    getHref : function(menuItemElem) {
        for (var i in cMenu) {
            // find the cMenu object
            if (cMenu[i].menuID == menuItemElem.parentNode.id) {
                for (var j = 0; j < cMenu[i].menuItems.length; j++) {
                    // find the item whose label matches the menu item text
                    if (menuItemElem.firstChild.nodeValue == cMenu[i].menuItems[j].label) {
                        return cMenu[i].menuItems[j].href;
                    }
                }
            }
        }
        return "";
    },
    // returns event coordinates on the page (for showContextMenu())
    getPageEventCoords : function(evt) {
        var coords = {left:0, top:0};
        if (evt.pageX) {
            coords.left = evt.pageX;
            coords.top = evt.pageY;
        } else if (evt.clientX) {
            coords.left = 
                evt.clientX + document.body.scrollLeft - document.body.clientLeft;
            coords.top = 
                evt.clientY + document.body.scrollTop - document.body.clientTop;
            // include html element space, if applicable
            if (document.body.parentElement && document.body.parentElement.clientLeft) {
                var bodParent = document.body.parentElement;
                coords.left += bodParent.scrollLeft - bodParent.clientLeft;
                coords.top += bodParent.scrollTop - bodParent.clientTop;
            }
        }
        return coords;
    },
    // get all elements within document having a particular class name
    getElementsByClassName : function(className) {
        var allElements = (document.all) ? document.all : document.getElementsByTagName("*");
        var results = new Array();
        var re = new RegExp("\\b" + className + "\\b");
        for (var i = 0; i < allElements.length; i++) {
            if (re.test(allElements[i].className)) {
                results.push(allElements[i]);
            }
        }
        return results;
    },
    // generate context menu elements associated with each "contextEntry" class element
    createContextMenus : function() {
        var hotItems = this.getElementsByClassName("contextEntry");
        for (var i = 0; i < hotItems.length; i++) {
            appendContextMenu(hotItems[i].id);
            hotItems[i].className = "contextEntryLive";
            var menuAction = (navigator.userAgent.indexOf("Mac") != -1) ? "Ctrl-click " : "Right click ";
            hotItems[i].title = menuAction + "to view relevant links";
            addEvent(hotItems[i], "contextmenu", function(evt) {cMenuMgr.showContextMenu(evt)}, false);
        }
        // build ul/li elements and put into body
        function appendContextMenu(id) {
            var cMenuData = cMenu[id];
            var ul = document.createElement("ul");
            var li;
            ul.id = cMenuData.menuID;
            ul.className = "contextMenus";
            for (var j = 0; j < cMenuData.menuItems.length; j++) {
                li = document.createElement("li");
                li.className = "menuItem";
                li.appendChild(document.createTextNode(cMenuData.menuItems[j].label));
                ul.appendChild(li);
            }
            document.body.appendChild(ul);
        }
    },
    // bind events and initialize tooltips
    initContextMenus : function() {
        var isNotOpera = navigator.userAgent.indexOf("Opera") == -1;
        if (cMenu && document.getElementById && isNotOpera) {
            // generate context menu elements
            this.createContextMenus();
            // click outside of context menu hides menu
            addEvent(window, "click", function() {cMenuMgr.hideContextMenus()}, false);
            // set events for items inside context menu
            var contextMenuList = this.getElementsByClassName("contextMenus");
            for (var i = 0; i < contextMenuList.length; i++) {
                addEvent(contextMenuList[i], "click", function() {cMenuMgr.hideContextMenus()}, false);
                addEvent(contextMenuList[i], "mouseup", function(evt) {cMenuMgr.execMenu(evt)}, false);
                addEvent(contextMenuList[i], "mouseover", cMenuMgr.toggleHighlight, false);
                addEvent(contextMenuList[i], "mouseout", cMenuMgr.toggleHighlight, false);
            }
        }
    }
};

addOnLoadEvent(function() {cMenuMgr.initContextMenus()});