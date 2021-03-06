// Read the name, id, type, and value of one form control element
// as requested by form2ArrayString()
function formObj2String(obj) {
	var output = "{";
	if (obj.name) {
		output += "name:'" + obj.name + "',";
	}
	if (obj.id) {
		output += "id:'" + obj.id + "',";
	}
	output += "type:'" + obj.type + "',";
	switch (obj.type) {
		case "radio":
			if (obj.name) {
				obj = document.forms[0].elements[obj.name];
				var radioVal = "value:false,index:-1";
				for (var i = 0; i < obj.length; i++) {
					if (obj[i].checked) {
						radioVal = "value:true,index:" + i;
						i = obj.length;
					} 
				}
				output += radioVal;
			} else {
				output += "value:" + obj.checked;
			}
			break;
		case "checkbox":
			output += "value:" + obj.checked;
			break;
		case "select-one":
			output += "value:" + obj.selectedIndex;
			break;
		case "select-multiple":
			output += "value:" + obj.selectedIndex;
			break;
		case "text":
			output += "value:'" + escape(obj.value) + "'";
			break;
		case "textarea":
			output += "value:'" + escape(obj.value) + "'";
			break;
		case "password":
			output += "value:'" + escape(obj.value) + "'";
			break;
		case "hidden":
			output += "value:'" + escape(obj.value) + "'";
			break;
		default:
			output += "";
	}
	output += "}"
	return output;
}

// Convert a passed form reference to a string formatted like
// a JavaScript array of objects
function form2ArrayString(form) {
	var elem, lastName = "";
	var output = "[";
	for (var i = 0; i < form.elements.length; i++) {
		elem = form.elements[i];
		if (elem.name && (elem.name != lastName)) {
			output += formObj2String(form.elements[i]) + ",";
			lastName = elem.name;
		}
	}
	output = output.substring(0, output.length-1) + "]";
	return output;
}

// Distribute form control values from another source to the
// controls in this page's form, whose names/ids match those
// of the original form controls
function string2FormObj(form, str) {
	var elem, objArray = eval(str);
	for (var i = 0; i < objArray.length; i++) {
		elem = (objArray[i].name) ? form.elements[objArray[i].name] : document.getElementById(objArray[i].id);
		switch (objArray[i].type) {
			case "radio":
				if (objArray[i].name && objArray[i].value && objArray[i].index >= 0) {
					elem = elem[objArray[i].index];
				}
				elem.checked = objArray[i].value;
				break;
			case "checkbox":
				elem.checked = objArray[i].value;
				break;
			case "select-one":
				elem.selectedIndex = objArray[i].value;
				break;
			case "select-multiple":
				elem.selectedIndex = objArray[i].value;
				break;
			default:
				elem.value = unescape(objArray[i].value);
		}
	}
}

