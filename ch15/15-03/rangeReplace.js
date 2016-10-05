// Return TextRange.findText() third parameter arguments
function getSearchArgs(caseSensitive) {
    return (caseSensitive) ? 4 : 0;
}

// Unprompted search and replace
function srBatch(container, search, replace, caseSensitive) {
    var rng;
    if (document.body.createTextRange) {
        // IE branch
        var args = getSearchArgs(caseSensitive);
        var found = "";
        rng = document.body.createTextRange();
        rng.moveToElementText(container);
        clearUndoBuffer();
        for (var i = 0; rng.findText(search, 1000000, args); i++) {
            found = rng.text;
            rng.text = replace;
            pushUndoNew(rng, search, replace, found);
            rng.collapse(false)  ;   
        }
        alert("Search completed.");
    } else if (document.createRange && window.find) {
        // Mozilla (W3C) branch
        var sel;
        var args = caseSensitive || false;
        while (window.find(search, args)) {
            sel = window.getSelection();
            if (sel.anchorNode) {
                rng = sel.getRangeAt(0);
                if (rng.intersectsNode(container)) {
                    pushUndoNew(rng, search, replace, rng.toString());
                    rng.deleteContents();
                    rng.insertNode(document.createTextNode(replace));
                    rng.startContainer.parentNode.normalize();
                }
            }
        }
        alert("Search completed.");
    }
}

// Prompted search and replace
function srQuery(container, search, replace, caseSensitive) {
    var rng;
    if (document.body.createTextRange) {
        // IE branch
        var args = getSearchArgs(caseSensitive);
        var found = "";
        rng = document.body.createTextRange();
        rng.moveToElementText(container);
        clearUndoBuffer();
        while (rng.findText(search, 10000, args)) {
            rng.select();
            found = rng.text;
            rng.scrollIntoView();
            if (confirm("Replace?")) {
                rng.text = replace;
                pushUndoNew(rng, search, replace, found);
            }
            rng.collapse(false)  ;
        }    
        alert("Search completed.");
    } else if (document.createRange && window.find) {
        // Mozilla (W3C) branch
        var sel;
        var args = caseSensitive || false;
        while (window.find(search, args)) {
            sel = window.getSelection();
            if (sel.anchorNode) {
                rng = sel.getRangeAt(0);
                if (rng.intersectsNode(container)) {
                    if (confirm("Replace?")) {
                        pushUndoNew(rng, search, replace, rng.toString());
                        rng.deleteContents();
                        rng.insertNode(document.createTextNode(replace));
                        rng.startContainer.parentNode.normalize();
                    } else {
                        // move selection beyond current item for next find()
                        rng.collapse(false);
                        sel.addRange(rng);
                    }
                }
            }
        }
        alert("Search completed.");
    }
}

/****************
    UNDO BUFFER
*****************/
// Temporary storage of undo information
var undoObject = {origSearchString:"",newRanges :[]};

// Store original search string and "bookmarks" of each replaced range
function pushUndoNew(rng, srchString, replString, foundString) {
    undoObject.origSearchString = srchString;
    if (rng.moveStart) {
        // IE branch
        rng.moveStart("character", -replString.length);
        var rngSpecs = {bookmark: rng.getBookmark(), found: foundString}
        undoObject.newRanges[undoObject.newRanges.length] = rngSpecs;
    } else if (rng.setStart) {
        // Mozilla (W3C) branch
        var rngSpecs = {node: rng.startContainer, start: rng.startOffset, end: rng.startOffset + replString.length, found: foundString};
        undoObject.newRanges[undoObject.newRanges.length] = rngSpecs;
    }
}

// Empty array and search string global
function clearUndoBuffer() {
    undoObject.origSearchString = "";
    undoObject.newRanges.length = 0;
}

// Perform the undo
function undoReplace() {
    if (undoObject.newRanges.length && undoObject.origSearchString) {
        if (document.body.createTextRange) {
            // IE branch
            rng = document.body.createTextRange();
            for (var i = 0; i < undoObject.newRanges.length; i++) {
                rng.moveToBookmark(undoObject.newRanges[i].bookmark);
                rng.text = undoObject.newRanges[i].found;
            }
             clearUndoBuffer();
        } else if (document.createRange) {
            // Mozilla (W3C) branch
            for (var i = undoObject.newRanges.length - 1; i >= 0 ; i--) {
                rng = document.createRange();
                rng.setStart(undoObject.newRanges[i].node, undoObject.newRanges[i].start);
                rng.setEnd(undoObject.newRanges[i].node, undoObject.newRanges[i].end);
                rng.deleteContents();
                rng.insertNode(document.createTextNode(undoObject.newRanges[i].found));
                rng.startContainer.parentNode.normalize();
            }
             clearUndoBuffer();
        }
    }
}
