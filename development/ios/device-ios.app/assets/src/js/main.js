//$('#placeInput').submit(function(){
//	console.log("in the submit");
//	var query= $("input#query").val();
//	alert("submitted!");
//	return false;
	
	//$.getJSON('https://api.foursquare.com/v2/venues/search?near=Tampa%2CFL&query='+query+'&client_id=AESY1ENXBRKZXCNFDUDR2R1WFGVLM2TQN2301V3FMUGW1BC2&client_secret=T4YY0SSSHX2MGRZHKH5GXC4XZAURILN1BFY2NAXV2ELMPJAC&v=20120621', function(response){
	//alert("JSON Data:" + response.response.venues[0].name);
	//});//end getJSON
// });//end submit binding

forge.topbar.addButton({
	text: "Search",
	position: "left"
});

util = {};	
util.rgeocode = function(lat,lon){
	$.ajax({
		url: "http://where.yahooapis.com/geocode?location="+lat+","+lon+"&appid=dEaFGa4g&flags=j&gflags=r",
		success: function(r){
			var locationData = [];
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