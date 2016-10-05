/* cookies.js */
/*
     Example File From "JavaScript and DHTML Cookbook"
     Second Edition
     Published by O'Reilly Media
     Copyright 2007 Danny Goodman
*/

// utility function to retrieve an expiration date in proper 
// format; pass three integer parameters for the number of days, hours, 
// and minutes from now you want the cookie to expire (or negative 
// values for a past date); all three parameters are required, 
// so use zeros where appropriate 
function getExpDate(days, hours, minutes) { 
    var expDate = new Date(); 
    if (typeof days == "number" && typeof hours == "number" && 
        typeof minutes == "number") { 
        expDate.setDate(expDate.getDate() + parseInt(days)); 
        expDate.setHours(expDate.getHours() + parseInt(hours)); 
        expDate.setMinutes(expDate.getMinutes() + parseInt(minutes)); 
        return expDate.toUTCString(); 
    } 
} 
// utility function called by getCookie() 
function getCookieVal(offset) { 
    var endstr = document.cookie.indexOf (";", offset); 
    if (endstr == -1) { 
        endstr = document.cookie.length; 
    } 
    return decodeURI(document.cookie.substring(offset, endstr)); 
} 
// primary function to retrieve cookie by name 
function getCookie(name) { 
    var arg = name + "="; 
    var alen = arg.length; 
    var clen = document.cookie.length; 
    var i = 0; 
    while (i < clen) { 
        var j = i + alen; 
        if (document.cookie.substring(i, j) == arg) { 
            return getCookieVal(j); 
        } 
        i = document.cookie.indexOf(" ", i) + 1; 
        if (i == 0) break; 
    } 
    return ""; 
} 
// store cookie value with optional details as needed 
function setCookie(name, value, expires, path, domain, secure) { 
    document.cookie = name + "=" + encodeURI(value) + 
        ((expires) ? "; expires=" + expires : "") + 
        ((path) ? "; path=" + path : "") + 
        ((domain) ? "; domain=" + domain : "") + 
        ((secure) ? "; secure" : ""); 
} 
// remove the cookie by setting ancient expiration date 
function deleteCookie(name,path,domain) { 
    if (getCookie(name)) { 
        document.cookie = name + "=" + 
            ((path) ? "; path=" + path : "") + 
            ((domain) ? "; domain=" + domain : "") + 
            "; expires=Thu, 01-Jan-70 00:00:01 GMT"; 
    } 
} 
