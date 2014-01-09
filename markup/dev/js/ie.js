$(document).on('click','span.radio,span.checkbox', function () {
	var input = $(this).prev('input');
	input.prop('checked',!input.prop('checked')).trigger('change');
});
$(document).on('click','label', function (e) {
	if (!$(e.target).hasClass('radio checkbox')){
		var input = $(this).find('input');
		input.prop('checked',!input.prop('checked')).trigger('change');
	}
});
$(function () {
	$('input:radio').on('change', function () {
		$('input:radio[name='+$(this).attr('name')+']').each(function() {
			if ($(this).prop('checked')){
				$(this).parent().addClass('checked');
			} else {
				$(this).parent().removeClass('checked');
			}
		});
	});
	$('input:checkbox').on('change', function () {
		if($(this).prop('checked')){
			$(this).parent().addClass('checked');
		} else {
			$(this).parent().removeClass('checked');
		}
	});
})
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