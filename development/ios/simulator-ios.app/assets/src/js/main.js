util = {};	
util.rgeocode = function(lat,lon){
	$.ajax({
		url: "http://where.yahooapis.com/geocode?location="+lat+","+lon+"&appid=dEaFGa4g&flags=j&gflags=r",
		success: function(r){
			var locationData = [];
			window.r = r;
			locationData["city"] = r.ResultSet.Results[0].city;
			locationData["state"] = r.ResultSet.Results[0].statecode;
			window.App.User.set({ //this needs to eventually pass back to the user model, to separate concerns
				"city" : locationData["city"],
				"state" : locationData["state"]
			});
		},
		error: function(r){
			return r.ResultSet.ErrorMessage;
		}	
	});
}

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}

spin = {};
spin.opts = {
  lines: 13, // The number of lines to draw
  length: 8, // The length of each line
  width: 3, // The line thickness
  radius: 11, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  color: '#000', // #rgb or #rrggbb
  speed: 1, // Rounds per second
  trail: 69, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};
