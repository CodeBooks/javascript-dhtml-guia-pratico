// global menu state
var menuReady = false;

// pre-cache menubar image pairs
if (document.images) {
    var imagesNormal = new Array();
    imagesNormal["home"] = new Image(20, 80);
    imagesNormal["home"].src = "home_off.jpg";
    imagesNormal["catalog"] = new Image(20, 80);
    imagesNormal["catalog"].src  = "catalog_off.jpg";
    imagesNormal["about"] = new Image(20, 80);
    imagesNormal["about"].src  = "about_off.jpg";

    var imagesHilite = new Array();
    imagesHilite["home"] = new Image(20, 80);
    imagesHilite["home"].src = "home_on.jpg";
    imagesHilite["catalog"] = new Image(20, 80);
    imagesHilite["catalog"].src  = "catalog_on.jpg";
    imagesHilite["about"] = new Image(20, 80);
    imagesHilite["about"].src  = "about_on.jpg";
}

function getElementStyle(elem, CSSStyleProp) {
    var styleValue, camel;
    if (elem) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
            // W3C DOM version
            var compStyle = document.defaultView.getComputedStyle(elem, "");
            styleValue = compStyle.getPropertyValue(CSSStyleProp);
        } else if (elem.currentStyle) {
            // make IE style property camelCase name from CSS version
            var IEStyleProp = CSSStyleProp;
            var re = /-\D/;
            while (re.test(IEStyleProp)) {
                camel = IEStyleProp.match(re)[0].charAt(1).toUpperCase();
                IEStyleProp = IEStyleProp.replace(re, camel);
            }
            styleValue = elem.currentStyle[IEStyleProp];
        }
    }
    return (styleValue) ? styleValue : null;
}

// carry over some critical menu style sheet attribute values
var CSSRuleValues = {menuItemHeight:"18px",
                     menuWrapperBorderWidth:"2px",
                     menuWrapperPadding:"3px",
                     defaultBodyFontSize:"12px"
                    };

// specifications for menu contents and menubar image associations
var menus = new Array();
menus[0] = {mBarImgId:"menuImg_1",
            mBarImgNormal:imagesNormal["home"],
            mBarImgHilite:imagesHilite["home"],
            menuItems:[],
            elemId:""
           };
menus[1] = {mBarImgId:"menuImg_2",
            mBarImgNormal:imagesNormal["catalog"],
            mBarImgHilite:imagesHilite["catalog"],
            menuItems:[ {text:"Deluxe Line", href:"catalog_deluxe.html"},
                        {text:"Budget Line", href:"catalog_budget.html"},
                        {text:"Export", href:"catalog_export.html"},
                        {text:"Order Print Catalog", href:"catalog_order.html"}
                      ],
            elemId:""
           };
menus[2] = {mBarImgId:"menuImg_3", 
            mBarImgNormal:imagesNormal["about"],
            mBarImgHilite:imagesHilite["about"],
            menuItems:[ {text:"Press Releases", href:"press.html"},
                        {text:"Executive Staff", href:"staff.html"},
                        {text:"Map to Our Offices", href:"map.html"},
                        {text:"Company History", href:"history.html"},
                        {text:"Job Postings", href:"jobs.html"},
                        {text:"Contact Us", href:"contact.html"}
                      ],
            elemId:""
           };

// create hash table-like lookup for menu objects with id string indexes
function makeHashes() {
    for (var i = 0; i < menus.length; i++) {
        menus[menus[i].elemId] = menus[i];
        menus[menus[i].mBarImgId] = menus[i];
    }
}

// assign menu label image event handlers
function assignLabelEvents() {
    var elem;
    for (var i = 0; i < menus.length; i++) {
        elem = document.getElementById(menus[i].mBarImgId);
        elem.onmouseover = swap;
        elem.onmouseout = swap;
    }
}

// invoked from init(), generates the menu div elements and their contents.
// all this action is invisible to user during construction
function makeMenus() {
    var menuDiv, menuItem, itemLink, mbarImg, textNode, offsetLeft, offsetTop;
    
    // determine key adjustment factors for the total height of menu divs
    
    var menuItemH = 0;
    var bodyFontSize = parseInt(getElementStyle(document.body, "font-size"));
    // test to see if browser's font size has been adjusted by the user
    // and that the new size registers as an applied style property
    if (bodyFontSize == parseInt(CSSRuleValues.defaultBodyFontSize)) {
        menuItemH = (parseFloat(CSSRuleValues.menuItemHeight));
    } else {
        // works nicely in Mozilla
        menuItemH = parseInt(parseFloat(CSSRuleValues.menuItemLineHeight) * bodyFontSize);
    }
    var heightAdjust = parseInt(CSSRuleValues.menuWrapperPadding) + 
        parseInt(CSSRuleValues.menuWrapperBorderWidth);
    if (navigator.appName == "Microsoft Internet Explorer" && 
        navigator.userAgent.indexOf("Win") != -1 && 
        (typeof document.compatMode == "undefined" || 
        document.compatMode == "BackCompat")) {
        heightAdjust = -heightAdjust;
    }
    
    // use menus array to drive div creation loop
    for (var i = 0; i < menus.length; i++) {
        menuDiv = document.createElement("div");
        menuDiv.id = "popupmenu" + i;
        // preserve menu's ID as property of the menus array item
        menus[i].elemId = "popupmenu" + i;
        menuDiv.className = "menuWrapper";
        if (menus[i].menuItems.length > 0) {
            menuDiv.style.height = (menuItemH * menus[i].menuItems.length) - 
            heightAdjust + "px";
        } else {
            // don't display any menu div lacking menu items
            menuDiv.style.display = "none";
        }
        // define event handlers
        menuDiv.onmouseover = keepMenu;
        menuDiv.onmouseout = requestHide;

        // set stacking order in case other layers are around the page
        menuDiv.style.zIndex = 1000;
        
        // assemble menu item elements for inside menu div
        for (var j = 0; j < menus[i].menuItems.length; j++) {
            menuItem = document.createElement("div");
            menuItem.id = "popupmenuItem_" + i + "_" + j;
            menuItem.className = "menuItem";
            menuItem.onmouseover = toggleHighlight;
            menuItem.onmouseout = toggleHighlight;
            menuItem.onclick = hideMenus;
            menuItem.style.top = menuItemH * j + "px";
            itemLink = document.createElement("a");
            itemLink.href = menus[i].menuItems[j].href;
            itemLink.className = "menuItem";
            itemLink.onmouseover = toggleHighlight;
            itemLink.onmouseout = toggleHighlight;
            textNode = document.createTextNode(menus[i].menuItems[j].text);
            itemLink.appendChild(textNode);
            menuItem.appendChild(itemLink);
            menuDiv.appendChild(menuItem);
        }
        // append each menu div to the body
        document.body.appendChild(menuDiv);
    }
    makeHashes();
    assignLabelEvents();
    // pre-position menu
    for (i = 0; i < menus.length; i++) {
        positionMenu(menus[i].elemId);
    }
    menuReady = true;
}

// initialize global that helps manage menu hiding
var timer;

// invoked from mouseovers inside menus to cancel hide
// request from mouseout of menu bar image et al.
function keepMenu() {
    clearTimeout(timer);
}

function cancelAll() {
    keepMenu();
    menuReady = false;
}

// invoked from mouseouts to request hiding all menus
// in 1/4 second, unless cancelled
function requestHide() {
    timer = setTimeout("hideMenus()", 250);
}

// "brute force" hiding of all menus and restoration
// of normal menu bar images
function hideMenus() {
    for (var i = 0; i < menus.length; i++) {
       document.getElementById(menus[i].mBarImgId).src = menus[i].mBarImgNormal.src;
       var menu = document.getElementById(menus[i].elemId)
       menu.style.visibility = "hidden";
    }
}

// set menu position just before displaying it
function positionMenu(menuId){
    // use the menu bar image for position reference of related div
    var mBarImg = document.getElementById(menus[menuId].mBarImgId);
    var offsetTrail = mBarImg;
    var offsetLeft = 0;
    var offsetTop = 0;
    while (offsetTrail) {
        offsetLeft += offsetTrail.offsetLeft;
        offsetTop += offsetTrail.offsetTop;
        offsetTrail = offsetTrail.offsetParent;
    }
    if (navigator.userAgent.indexOf("Mac") != -1 && 
        typeof document.body.leftMargin != "undefined") {
        offsetLeft += document.body.leftMargin;
        offsetTop += document.body.topMargin;
    }
    var menuDiv = document.getElementById(menuId);
    menuDiv.style.left = offsetLeft + "px";
    menuDiv.style.top = offsetTop + mBarImg.height + "px";
}

// display a particular menu div
function showMenu(menuId) {
    if (menuReady) {
        keepMenu();
        hideMenus();
        positionMenu(menuId);
        var menu = document.getElementById(menuId);
        menu.style.visibility = "visible";
    }
}

// menu bar image swapping, invoked from mouse events in menu bar
// swap style sheets for menu items during rollovers
function toggleHighlight(evt) {
    evt = (evt) ? evt : ((event) ? event : null);
    if (typeof menuReady != "undefined") {
        if (menuReady && evt) {
            var elem = (evt.target) ? evt.target : evt.srcElement;
            if (elem.nodeType == 3) {
                elem = elem.parentNode;
            }
            if (evt.type == "mouseover") {
                keepMenu();
                elem.className ="menuItemOn";
            } else {
                elem.className ="menuItem";
                requestHide();
            }
            evt.cancelBubble = true;
        }
    }
}

function swap(evt) {
    evt = (evt) ? evt : ((event) ? event : null);
    if (typeof menuReady != "undefined") {
        if (evt && (document.getElementById && document.styleSheets) && menuReady) {
            var elem = (evt.target) ? evt.target : evt.srcElement;
            if (elem.className == "menuImg") {
                if (evt.type == "mouseover") {
                    showMenu(menus[elem.id].elemId);
                    elem.src = menus[elem.id].mBarImgHilite.src;
                } else if (evt.type == "mouseout") {
                    requestHide();
                }
                evt.cancelBubble = true;
            }
        }
    }
}

// create menus only if key items are supported
function initMenus() {
    if (document.getElementById && document.styleSheets) {
        setTimeout("makeMenus()", 5);
        window.onunload=cancelAll;
    }
}

addOnLoadEvent(initMenus);