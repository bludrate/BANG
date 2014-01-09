var ui = {};

ui.initElems = [];
ui.init = function(){
	var i;
	for (i=0; i<this.initElems.length; i++){
		this[this.initElems[i]]();
	}
};
$(function () {
	ui.init();
});