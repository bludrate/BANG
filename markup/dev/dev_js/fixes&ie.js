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