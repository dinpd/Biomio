function showMoreInfo(selector){
	var o = $('.tile.'+selector).offset();
	var h = $('.tile.'+selector).innerHeight();
	window.status = "left: "+o.left+" / top: "+o.top;
	$('.biomio-rollover-content.'+selector).show();
	$('.biomio-rollover-content.'+selector).offset({ top: Math.floor(o.top)+h });
}
function hideMoreInfo(selector){
	$('.biomio-rollover-content.'+selector).hide();
}