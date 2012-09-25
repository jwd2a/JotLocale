/*HUB VERSION*/

/* models FTW! */

window.Credentials = Backbone.Model.extend({
	
});

window.Place = Backbone.Model.extend({
	initialize: function(){
		
	},
	
	defaults: {
		"photo" : "test"
	},
	
	save: function() {
		var self=this;
		self.vid = self.get("id");
		this.userPlaceKey = window.App.User.get("id")+self.vid; //this creates the id for the object, a hash of the user and the place.
		APIdata = {};	
		APIdata[this.userPlaceKey] = {}; //this key has to be unique to prevent overwriting
		APIdata[this.userPlaceKey] = 
			{
				"type" : "userplace",
				"userID" : window.App.User.get("id"),
				"id" : self.vid,
				"name" : self.get("name"),
				"category" : self.get("categories")[0].name,
				"address" : self.get("location").address,
				"city" : self.get("location").city,
				"state" : self.get("location").state,
				"zip" : self.get("location").postalCode,
				"lat" : self.get("location").lat,
				"long" : self.get("location").lng, 
				"notes" : $("#notes").val(), 
				"referrer" : $("#recommendedBy").val(),
				"savedDate" : new Date().toJSON(),
				"updatedDate" : new Date().toJSON()
			};

		$.ajax({
			url: "https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/text",
			type: "PUT",
			contentType: "application/json",
			data: JSON.stringify(APIdata),
			processData: false,
			headers: {
				"X-CloudMine-ApiKey": "b0237dff1dbd4dd18e966a5cccfb06d1"
			},
			success: function() {
				App.navigate("#myplaces", {trigger:true});
			},
			error: function() {
				
			}
		});
	},
	
	del: function() {
		var self=this;
		$.ajax({
			url: "https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/data?keys="+self.userPlaceKey,
			type: "DELETE",
			contentType: "application/json",
			processData: false,
			headers: {
				"X-CloudMine-ApiKey": "b0237dff1dbd4dd18e966a5cccfb06d1"
			},
			success: function() {
				alert("Deleted!");
				App.navigate("#myplaces", {trigger:true});
			},
			error: function() {
				
			}
		});
	},
	
	getPhoto: function() {
		var self = this;
		self.vid = self.get("id");
		$.ajax({
			url: "https://api.foursquare.com/v2/venues/"+self.vid+"/photos?v=20120319&client_id=AESY1ENXBRKZXCNFDUDR2R1WFGVLM2TQN2301V3FMUGW1BC2&client_secret=T4YY0SSSHX2MGRZHKH5GXC4XZAURILN1BFY2NAXV2ELMPJAC&group=venue&limit=10",
			type: "GET",
			success: function(e) {
				var photo = e.response.photos.items[0].sizes.items[0].url;
				self.set({"photo" : photo});
			},
			error: function(e) {
				console.log("error" + e);
			}
		});	
	}
});

window.User = Backbone.Model.extend({
	
	defaults: {
		"id" : null,
		"email" : null,
		"password" : null
	},
	
	initialize: function() {
		if(!(this.get("lat"))) {
			this.getLocation();
		}
	},
	
	getLocation: function() {
		var self=this;
		forge.geolocation.getCurrentPosition(function(position){
			self.set({
					"lat" : position.coords.latitude, 
					"long" : position.coords.longitude
					});
		
				util.rgeocode(position.coords.latitude,position.coords.longitude);
		});		
	},
	
	register: function(email, password){
		var self=this;
		window.console.log("starting to register");
		var registerResponse = $.ajax({
			url: "https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/account/create",
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({
				"credentials" : {
					"email" : email,
					"password" : password
					}
			}),
			processData: false,
			headers: {
				"X-CloudMine-ApiKey": "b0237dff1dbd4dd18e966a5cccfb06d1"
			},
			success: function() {
				
			}
		});
	},
	
	login: function(email, password) {
		var self=this;
		var loginstring = "Basic " + base64.encode(email+":"+password);
		console.log(loginstring);
		window.console.log("logging in");
		this.loginResponse = $.ajax({
			url: "https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/account/login",
			type: "POST",
			contentType: "application/json",
			headers: {
				"X-CloudMine-ApiKey": "b0237dff1dbd4dd18e966a5cccfb06d1",
				"Authorization" : loginstring
			},
			success: function(r) {
				$.cookie("sess_token", r.session_token, {expires: 14})
				window.App.User.set({"id" : r.profile.__id__});
				window.App.navigate("#home", {trigger: true});
			}
		});
	},
	
	checkLoginStatus: function() {
		var self=this;
		this.sess_token = $.cookie("sess_token");
		$.ajax({
			url: "https://api.cloudmine.me/v1/app/6189edefd59c4f4b99717c2aaae23f60/account/mine",
			type: "GET",
			contentType: "application/json",
			headers: {
				"X-CloudMine-ApiKey": "b0237dff1dbd4dd18e966a5cccfb06d1",
				"X-CloudMine-SessionToken" : this.sess_token
			},
			success: function(c) {
				var obj = c.success[ Object.keys( c.success )[0] ];
				window.App.User.set({"id" : obj.__id__});
				window.App.navigate("#home", {trigger: true});
			},
			error: function () {
				window.App.navigate("#login", {trigger: true});
			}
		});
	}
});