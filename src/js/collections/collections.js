/* Collections */

window.Places = Backbone.Collection.extend({
	
	initialize: function(models, options){
	this.placeName = options.query;
	this.loc = options.loc;
	},
	
	model: Place,
	
	url: function() {
		return "https://api.foursquare.com/v2/venues/search?v=20120321&intent=checkin&query="+this.placeName+"&client_id=AESY1ENXBRKZXCNFDUDR2R1WFGVLM2TQN2301V3FMUGW1BC2&client_secret=T4YY0SSSHX2MGRZHKH5GXC4XZAURILN1BFY2NAXV2ELMPJAC&near="+this.loc;
	},
	
	parse: function(resp, xhr) {
		return resp.response.venues
	},
	
	getUsersPlaces: function () {
	}
});

window.SavedPlaces = Backbone.Collection.extend({
	initialize: function(models, options){
		this.userID = window.App.User.get("id");
		if (window.App.User.get("city")) { //fallback feature to handle instance where device has no geolocation
			this.getByDistance();
		}
		else {
			this.getByState();
		}
		
	},
	
	model: Place,
	
	getByState: function() {
		this.sortMode = "state";
		this.url = 'https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/search?q=[type="userplace",status != "tried", userID="'+this.userID+'"]&sort=sortableCity';
		this.fetch();
	},
	
	getByDistance: function() {
		this.sortMode = "distance";
		this.url = 'https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/search?q=[type="userplace",userID="'+this.userID+'",location near ('+window.App.User.get("long")+','+window.App.User.get("lat")+')]&distance=true&units=mi';
		console.log(this.url);
		this.fetch();
	},
	
	parse: function(resp, xhr) {
		var self = this;
		window.meta = resp.meta;
		var array = [];
		_.each(resp.success, function(value, key) {   
		    array.push(value);
			if (resp.meta) {
				var distance = resp.meta[key]["geo"]["distance"];
			 	value["distance"] = distance;
			 	}
		});
		return array;
	}

})