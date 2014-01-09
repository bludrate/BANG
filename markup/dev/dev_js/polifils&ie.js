if (!Array.prototype.indexOf) { 
    Array.prototype.indexOf = function(obj, start) {
         for (var i = (start || 0), j = this.length; i < j; i++) {
             if (this[i] === obj) { return i; }
         }
         return -1;
    }
}
if (!("trim" in String.prototype)){
	String.prototype.trim = function() {
	    return this.replace(/^\s+|\s+$/g,"");
	}
}
if (!("trimLeft" in String.prototype)){
	String.prototype.trimLeft = function() {
	    return this.replace(/^\s+/,"");
	}
}
if (!("trimRight" in String.prototype)){
	String.prototype.trimRight = function() {
   		return this.replace(/\s+$/,"");
	}
}