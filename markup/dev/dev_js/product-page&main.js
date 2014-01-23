ui.productPopupGallery = function () {
	$('.product-popup__gallery').roundabout({
		"childSelector": "img",
		"minScale": 0.3
	});
}
ui.initElems.push("productPopupGallery");