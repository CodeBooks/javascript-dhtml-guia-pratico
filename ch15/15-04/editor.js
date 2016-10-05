var editableDoc = {
    doc : null,
    setFontColor : function(evt) {
        if (editableDoc.doc) {
            editableDoc.doc.execCommand("forecolor", false, editableDoc.getElem(evt).value);
        }
    },
    setFontStyle : function(evt) {
        if (editableDoc.doc) {
            editableDoc.doc.execCommand(editableDoc.getElem(evt).value, false, null);
        }
    },
    setFontFamily : function(evt) {
        if (editableDoc.doc) {
            editableDoc.doc.execCommand("fontname", false, editableDoc.getElem(evt).value);
        }
    },
    getElem : function(evt) {
        evt = evt || window.event;
        var elem = evt.target || evt.srcElement;
        return elem;
    },
    init : function(elemID) {
        var iframe = document.getElementById(elemID);
        if (iframe.contentWindow) {
            editableDoc.doc = iframe.contentWindow.document;
        } else if (iframe.contentDocument) {
            editableDoc.doc = iframe.contentDocument;
        }
        if (editableDoc.doc && editableDoc.doc.designMode) {
            editableDoc.doc.designMode = "on";
        }
    }
}
