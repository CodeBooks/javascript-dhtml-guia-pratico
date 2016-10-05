// One object tracks the current modal dialog opened from this window.
var dialogWin = {
    // Since links in some browsers cannot be truly disabled, preserve 
    // link click & mouseout event handlers while they're "disabled."
    // Restore when re-enabling the main window.
    linkClicks : null,
    // Event handler to inhibit Navigator 4 form element 
    // and IE link activity when dialog window is active.
    deadend : function(evt) {
        if (this.win && !this.win.closed) {
            if (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
            this.win.focus();
            return false;
        }
    },
    // Disable form elements and links in all frames.
    disableForms : function() {
        this.linkClicks = new Array();
        for (var i = 0; i < document.forms.length; i++) {
            for (var j = 0; j < document.forms[i].elements.length; j++) {
                document.forms[i].elements[j].disabled = true;
            }
        }
        for (i = 0; i < document.links.length; i++) {
            this.linkClicks[i] = {click:document.links[i].onclick, up:null};
            this.linkClicks[i].up = document.links[i].onmouseup;
            document.links[i].onclick = dialogWin.deadend;
            document.links[i].onmouseup = dialogWin.deadend;
            document.links[i].disabled = true;
        }
    },
    // Restore form elements and links to normal behavior.
    enableForms : function() {
        for (var i = 0; i < document.forms.length; i++) {
            for (var j = 0; j < document.forms[i].elements.length; j++) {
                document.forms[i].elements[j].disabled = false;
            }
        }
        for (i = 0; i < document.links.length; i++) {
            document.links[i].onclick = this.linkClicks[i].click;
            document.links[i].onmouseup = this.linkClicks[i].up;
            document.links[i].disabled = false;
        }
    },
    // Disable form elements.
    blockEvents : function() {
        this.disableForms();
        window.onfocus = dialogWin.checkModal;
        document.body.onclick = dialogWin.checkModal;
        addEvent(document, "click", dialogWin.checkModal, true);
        addEvent(document, "mousemove", dialogWin.checkModal, true);
    },
    // As dialog closes, restore the main window's original
    // event mechanisms.
    unblockEvents : function() {
        this.enableForms();
        window.onfocus = null;
        removeEvent(document, "click", dialogWin.checkModal, true);
        removeEvent(document, "mousemove", dialogWin.checkModal, true);
    },
    // Generate a modal dialog.
    // Parameters:
    //    url -- URL of the page/frameset to be loaded into dialog
    //    width -- pixel width of the dialog window
    //    height -- pixel height of the dialog window
    //    returnFunc -- reference to the function (on this page)
    //                  that is to act on the data returned from the dialog
    //    args -- [optional] any data you need to pass to the dialog
    openSimDialog : function(url, width, height, returnFunc, args) {
        if (!this.win || (this.win && this.win.closed)) {
            // Initialize properties of the modal dialog object.
            this.url = url;
            this.width = width;
            this.height = height;
            this.returnFunc = returnFunc;
            this.args = args;
            this.returnedValue = "";
            // Keep name unique.
            this.name = (new Date()).getSeconds().toString();
            // Assemble window attributes and try to center the dialog.
            if (window.screenX) {              // Moz, Saf, Op
                // Center on the main window.
                this.left = window.screenX + 
                   ((window.outerWidth - this.width) / 2);
                this.top = window.screenY + 
                   ((window.outerHeight - this.height) / 2);
                var attr = "screenX=" + this.left + 
                   ",screenY=" + this.top + ",resizable=no,width=" + 
                   this.width + ",height=" + this.height;
            } else if (window.screenLeft) {    // IE 5+/Windows 
                // Center (more or less) on the IE main window.
                // Start by estimating window size, 
                // taking IE6+ CSS compatibility mode into account
                var CSSCompat = (document.compatMode && document.compatMode != "BackCompat");
                window.outerWidth = (CSSCompat) ? document.body.parentElement.clientWidth : 
                    document.body.clientWidth;
                window.outerHeight = (CSSCompat) ? document.body.parentElement.clientHeight :  
                    document.body.clientHeight;
                window.outerHeight -= 80;
                this.left = parseInt(window.screenLeft+ 
                   ((window.outerWidth - this.width) / 2));
                this.top = parseInt(window.screenTop + 
                   ((window.outerHeight - this.height) / 2));
                var attr = "left=" + this.left + 
                   ",top=" + this.top + ",resizable=no,width=" + 
                   this.width + ",height=" + this.height;
            } else {                           // all the rest
                // The best we can do is center in screen.
                this.left = (screen.width - this.width) / 2;
                this.top = (screen.height - this.height) / 2;
                var attr = "left=" + this.left + ",top=" + 
                   this.top + ",resizable=no,width=" + this.width + 
                   ",height=" + this.height;
            }
            // Generate the dialog and make sure it has focus.
            this.win=window.open(this.url, this.name, attr);
            this.win.focus();
        } else {
            this.win.focus();
        }
    },
    // Invoked by focus event handler of EVERY frame,
    // return focus to dialog window if it's open.
    checkModal : function() {
        setTimeout("dialogWin.finishChecking()", 50);
        return true;
    },
    finishChecking : function() {
        if (this.win && !this.win.closed) {
            this.win.focus();
        }
    }
};
   
   
   
   
   
   
