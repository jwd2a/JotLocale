/*Views*/

//THIS IS THE HUB VERSION

/*The loginView View displays the login form*/

window.TempFBLogin = Backbone.View.extend({
	
	initialize: function() {
		this.template = _.template($('#fblogin-template').html());
		forge.tabbar.hide();
	},
	
	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},
	
	events: {
		"click #facebook" : "loginWithFacebook"
	},
	
	loginWithFacebook: function() {
		window.console.log("Ok, let's head to Facebook...");
		forge.facebook.authorize(
			function(token){
				window.console.log("success");
				window.console.log(token);
			},
			function(content){
				window.console.log("error");
				window.console.log(content)
			});
	},
	
	testAPI: function() {
		forge.facebook.api("me/posts", function(success){
			window.console.log(success);
		},
		function(error){
			window.console.log(error);
		});
	}
});

window.LoginView = Backbone.View.extend({
	
	initialize: function() {
		window.console.log("loginView");
		this.template = _.template($('#login-template').html());
		forge.tabbar.hide();
	},
	
	render: function() {
		forge.topbar.setTitle("JotLocale");
		forge.topbar.removeButtons();
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},
	
	events: {
		"click #submit" : "login",
		"click #loginForm>input" : "clearHints",
		"blur #loginForm>input" : "writeHints",
		"click #regButton" : "goRegister"
	},
		
		
	clearHints: function(e) {
		var value = $(e.target).val();
		if (value == "Your email address..." || value == "Your password...") {
			$(e.target).removeClass("withHint").val("");
		};
	},
	
	writeHints: function(e) {
		var value = $(e.target).val();
		if (value == "" && $(e.target).attr("id") == "password") {
			$(e.target).addClass("withHint").val("Your password...");
		};
		
		if (value == "" && $(e.target).attr("id") == "email") {
			$(e.target).addClass("withHint").val("Your email address...");
		};
	},
		
	goHome: function(){
		alert($("#username").val());
	},
	
	login: function(e){
		e.preventDefault();
		window.App.User = new User();
		var user = window.App.User;
		var email = $("#email").val();
		var password = $("#password").val();
		var response = user.login(email, password);
		window.console.log(response);
	},
	
	goRegister: function() {
		App.navigate("#register", {trigger: "true"});
	}
});

/* Registration View */

window.RegisterView = Backbone.View.extend({
	
	initialize: function() {
		this.template = _.template($('#register-template').html());

	},
	
	render: function() {
		forge.topbar.setTitle("Register");
		forge.topbar.removeButtons();
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},
	
	events: {
		"click #submitRegistration" : "processRegistration"
	},
	
	processRegistration: function(e){
		e.preventDefault();
		window.App.user = new User();
		var user = window.App.User;
		var email = $("#email").val();
		var password = $("#password").val();
		var response = user.register(email, password);
		
	}
	
})


/*Location Detail View shows information about a location*/
/*THIS IS A LEGACY VIEW FROM A PRIOR VERSION, MyLocationDetailView extends this, however, so left for now*/
/*TODO: Merge this view functionality with MyLocationDetailView and blow this view away*/

window.LocationDetailView = Backbone.View.extend({
	initialize: function() {
		this.template = _.template($('#locationDetail-template').html());
		_(this).bindAll("render", "renderPhoto");
		this.model.bind('change', this.renderPhoto);
		window.loc = this.model;
		this.model.getPhoto();
	},
	
	render: function(){
		forge.topbar.setTitle(this.model.get("name"));
		forge.topbar.addButton({
			text: "Back",
			position: "left",
			type: "back"
		});
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	},
	
	events: {
		"click #savePlace" : "savePlace"
	},

	savePlace: function() {
		this.model.save()
	},
	
	renderPhoto: function() {
		console.log(this.model);
		var photo = this.model.get("photo");
		$(".locationImage").html("<img src='"+photo+"' height='95' width='95' />");
	}
});

window.MyLocationDetailView = window.LocationDetailView.extend({
	initialize: function() {
	this.template = _.template($('#myLocationDetail-template').html());
	_(this).bindAll("render", "renderPhoto");
	this.model.bind('change', this.renderPhoto);
	window.loc = this.model;
	this.model.getPhoto();
	},
	
	events: {
		"click #removePlace" : "removePlace",
		"click #triedPlace" : "markAsDone"
	},
	
	removePlace: function () {
		this.model.del();
	},
	
	markAsDone: function() {
		this.model.markAsDone();
	}

})

window.MyPlacesView = Backbone.View.extend({
	initialize: function (){
		var self = this;
		this.template = _.template($('#myPlaces-template').html());	
		
	},
	
	events: {
		
		"click #sortCity" : "sortCity",
		"click #sortDistance" : "sortDistance"
		
	},
	
	render: function() {		
		forge.topbar.setTitle("JotLocale");
		forge.topbar.removeButtons();
		var self = this;
		$.mobile.showPageLoadingMsg();		
		var renderedContent = this.template();		
		self.list = "";
		self.currentCity = "";
		window.collection = this.collection;
		
		if(this.collection.sortMode == "state") {
		this.collection.bind("reset", function(collection) {
			$.mobile.hidePageLoadingMsg();
				collection.each(function(place) {
					if (place.get("location")["city"] != self.currentCity) {
						self.currentCity = place.get("location")["city"];
						self.list += "<li><h2>"+self.currentCity+", "+place.get("location")["state"]+"</h2></li>";
					}

					self.list += self.renderStandardListItem(place);	
				});
				
				$("ul#placeList").append(self.list).listview("refresh");
			});
			
			
			
		}
		
		if(this.collection.sortMode == "distance") {
			this.collection.bind("reset", function(collection) {
				$.mobile.hidePageLoadingMsg();
				var distanceMarker = null;
				collection.each(function(place) {
					
					if (place.get("distance") < 25) {
						if (distanceMarker == null) {
							distanceMarker = "near";
							self.list += "<li><h2>Nearby (within 25 miles)</h2></li>";
						}
						self.list += self.renderNearDistanceListItem(place);
					}
					
					if (place.get("distance") > 25) {
						if (distanceMarker == "near"){
							distanceMarker = "far";
							self.list += "<li><h2>Far away (more than 25 miles away)</h2></li>";
						}
						self.list += self.renderFarDistanceListItem(place);
					}
										
				});
				
				$("ul#placeList").append(self.list).listview("refresh");
				
			});
		}
		
		$(this.el).html(renderedContent);
		return this;
		
	},
	
	renderStandardListItem: function(place) {
		window.place = place;
		return "<li><a href='#mylocation/"+place.get("id")+"' data-transition='slide'><span class='listingName'>" + place.get("name") +"</span><span class='listingDetail'>" + place.get("location")["address"] + "</span><span class='listingDetail'>" + place.get("category") + "</span></a></li>";
	},
	
	renderNearDistanceListItem: function(place) {
		var distance = Math.round(place.get("distance")*10)/10;
		return "<li><a href='#mylocation/"+place.get("id")+"' data-transition='slide'><span class='distance'>"+distance+" mi</span><span class='listingName'>" + place.get("name") +"</span><span class='listingDetail'>" + place.get("location")["address"] + "</span><span class='listingDetail'>" + place.get("category") + "</span></a></li>";
	},
	
	renderFarDistanceListItem: function(place) {
		return "<li><a href='#mylocation/"+place.get("id")+"' data-transition='slide'><span class='distance'>"+place.get("location")["city"]+", "+place.get("location")["state"]+"</span><span class='listingName'>" + place.get("name") +"</span><span class='listingDetail'>" + place.get("location")["address"] + "</span><span class='listingDetail'>" + place.get("category") + "</span></a></li>";
	},
	
	sortCity: function(){
		this.collection.getByState();
	},
	
	sortDistance: function() {
		this.collection.getByDistance();
	}

});

window.AddItemView = Backbone.View.extend({
	initialize: function (){
		this.template = _.template($('#addItem-template').html());
	},
	
	render: function() {
		forge.topbar.setTitle(this.model.get("name"));
		forge.topbar.addButton({
				text: "Back",
				position: "left",
				type: "back"
			});
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		console.log(this.model.get("name"));
		$(this.el).find("input#placeName").val(this.model.get("name"));
		return this;
	},
	
	events: {
		"focus #placeName" : "goFindPlace",
		"click #savePlace" : "savePlace"
	},
	
	goFindPlace: function() {
		App.navigate("#findPlace", {trigger:true});
	},
	
	savePlace: function() {
		this.model.save();
	}
	
});

window.FindPlaceView = Backbone.View.extend({
	
	initialize: function() {
		this.template = _.template($('#findPlace-template').html());
	},
	
	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		$(this.el).on('load', function() { console.log("loaded"); $("#searchBox").focus(); });
		var input = $('#location', this.el).get(0);
		var options = {
		  types: ['(cities)']
		};
		autocomplete = new google.maps.places.Autocomplete(input, options);
		$('#location', this.el).val(window.App.User.get("city")+", "+window.App.User.get("state"));
		return this;
	},
	
	events: {
		"submit form#searchBar" : "processForm",
		"click li.result" : "saveItem"
	},
	
	setLocation: function(e) {
		$("#searchLocationInput").hide();
		this.setLocation = $("#location").val();
		$("#searchLocation").html(this.setLocation).show();
	},
	
	drawList: function(collection) {
			$("ul#resultsList").empty();
			window.searchresults = collection;
			window.testplace = collection[0];
			collection.each(function(place){
				if (!(place.get("location")["address"] = place.get("location")["address"])){
					place.get("location")["address"] = "";
				}
				
				if (place.get("categories").length == 0){
					console.log("this one has a length of zero");
					place.category = "";
				}
				else {
					console.log("this one has a length of 1");
					place.category = place.get("categories")[0]["name"];
				}
				
				$("ul#resultsList").append("<li class='result' data-id='"+place.get('id')+"'><span class='listingName'>" + place.get("name") +"</span><span class='listingDetail'>" + place.get("location")["address"] + "</span><span class='listingDetail'>" + place.category + "</span></li>");
			});
			$("ul#resultsList").listview("refresh");
	},
	
	processForm: function(e) {
		e.preventDefault();
		window.console.log("processForm");
		var self=this;
		this.querystring = $("#searchBox").val(); //get the query
		this.loc = $("#location").val();
		self.runQuery(this.querystring, this.loc);
		
	},
	
	runQuery: function(querystring, loc) {
		var self=this;
		self.collection = new Places(null, {query: querystring, loc: loc}); //create a new collection, passing the query to the Foursquare URL
		self.collection.fetch(); // fetch the collection from the URL, and populate the models

		self.collection.bind('reset', function(collection){
			self.drawList(collection);
		});
	},
	
	saveItem: function(e) {
	 var item = $(e.currentTarget).data("id");
	 window.newplace = this.collection.get(item);
	 App.navigate("#add", {trigger:true});
	},
	
	onClose: function(){
	    this.model.unbind("change", this.render);
	  }
	
});
	
