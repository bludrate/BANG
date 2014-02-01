(function () {
	function addMediaQueryClasses() {
		(function checkWidth () {
			var body = $(document.body);
			if (body.width()>1440 && !body.hasClass('w1440')) {
				body.addClass('w1440');
			}
			if (body.width()<=1440 && body.hasClass('w1440')) {
				body.removeClass('w1440');
			}
		})();
		$(window).resize(checkWidth);
	};
	if (!mediaQueriesEnabled()){
		addMediaQueryClasses();
	}
})();
function mediaQueriesEnabled (){
    return (window.matchMedia || window.msMatchMedia);
};