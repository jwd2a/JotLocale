/*Views*/

//THIS IS THE HUB VERSION
/*The loginView View displays the login form*/

window.LoginView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#login-template').html());
	},

	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},

	events: {
		"click #signInWithFacebookBtn": "loginWithFacebook",
		"vmousedown #signInWithFacebookBtn" : "highlightFBBtn",
		"vmouseup #signInWithFacebookBtn" : "unhighlightFBBtn"
	},

	loginWithFacebook: function() {
		console.log("logging in with Facebook...");
		var self=this;
		forge.facebook.authorize(["email"], function(response){
			var authResponse = response;
			var expire_date = new Date(authResponse.access_expires);
			forge.facebook.api('/me', function(response) {
				console.log(response);
				Parse.FacebookUtils.logIn({
					access_token: authResponse.access_token,
					expiration_date: expire_date.toISOString(),
					id: response.id
				}, {
				  success: function(user) {
				    if (!user.existed()) {	
						console.log(user);
						console.log("Ok, go home...");
						window.App.navigate("#myplaces", {trigger:true});
				    } else {
						console.log(user);
						console.log("Ok, go home 2...");
						window.App.navigate("#myplaces", {trigger:true});
				    }
				  },
				  error: function(user, error) {
					console.log(error);
				  }
				}); //end FB Util
			},
			function (FBAPIerror){
				console.log(FBAPIerror);
			});	//end API	
		}, 
		function(FBerror){
			console.log(FBerror);
		}); //end auth
	
 	},

	highlightFBBtn: function(e){
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");
	},
	
	unhighlightFBBtn: function(e){
		$(e.currentTarget).css("backgroundColor", "#3b5a9a");
	}
});

window.OldLoginView = Backbone.View.extend({

	initialize: function() {
		window.console.log("loginView");
		this.template = _.template($('#Oldlogin-template').html());
	},

	render: function() {
		forge.topbar.setTitle("JotLocale");
		forge.topbar.removeButtons();
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},

	events: {
		"click #submit": "login",
		"click #loginForm>input": "clearHints",
		"blur #loginForm>input": "writeHints",
		"click #regButton": "goRegister"
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

	goHome: function() {
		alert($("#username").val());
	},

	login: function(e) {
		e.preventDefault();
		window.App.User = new User();
		var user = window.App.User;
		var email = $("#email").val();
		var password = $("#password").val();
		var response = user.login(email, password);
		window.console.log(response);
	},

	goRegister: function() {
		App.navigate("#register", {
			trigger: "true"
		});
	}
});

/* Registration View */

window.RegisterView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#register-template').html());

	},

	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},

	events: {
		"click #submitRegistration": "processRegistration"
	},

	processRegistration: function(e) {
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
		this.renderPhoto();
	},

	render: function() {
		var renderedContent = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
		return this;
	},

	events: {
		"click #savePlace": "savePlace"
	},

	savePlace: function() {
		this.model.save()
	},

	renderPhoto: function() {
		console.log(this.model);
		var photo = this.get("photos").groups[0].items[0].prefix+"640x280"+suffix;
		$("#placeImg").attr("src", photo);
	}
});

window.MyLocationDetailView = window.LocationDetailView.extend({
	initialize: function() {
		this.template = _.template($('#myLocationDetail-template').html());
		_(this).bindAll("render", "renderPhoto");
		window.loc = this.model;
		if (this.model.get("url")){
			var locUrl = this.model.get("url");
			this.model.set({url:util.cleanUpURL(locUrl)});
		}

	},

	events: {
		"click #removePlace": "removePlace",
		"click #triedPlace": "markAsDone",
		"click .back" : "goBack",
		"click .edit" : "editPlace",
		"vmousedown .back" : "highlightBack",
		"vmouseup .back" : "unhighlightBack",
		"vmousedown .edit" : "highlightEdit",
		"vmouseup .edit" : "unhighlightEdit",
		"vmouseup .locationDetailBtn" : "highlightBtn",
		"vmousedown .locationDetailBtn" : "unhighlightBtn"
		
	},

	removePlace: function() {
		this.model.del();
	},
	
	
	editPlace: function() {
		window.model = this.model;
		window.App.navigate("#editPlace", {trigger:true});
	},
	

	markAsDone: function() {
		this.model.markAsDone();
	},
	
	goBack: function() {
		window.App.navigate("myplaces", {trigger:true});
	},
	
	highlightBack: function(e) {
			util.highlightOnVMouseDown(e, "back");
	},
	
	unhighlightBack: function(e) {
			util.unhighlightOnVMouseUp(e, "back");
	},
	
	highlightEdit: function(e) {
			util.highlightOnVMouseDown(e, "edit");
	},
	
	unhighlightEdit: function(e) {
			util.unhighlightOnVMouseUp(e, "edit");
	},

	highlightBtn: function(e){
		window.BtnBGColor = $(e.currentTarget).css("backgroundColor");
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");
	},
	
	unhighlightBtn: function(e){
		$(e.currentTarget).css("backgroundColor", window.BtnBGColor);
	},

})

window.MyPlacesView = Backbone.View.extend({
	initialize: function() {
		var self = this;
		this.template = _.template($('#myPlaces-template').html());
		_(this).bindAll("render");
		this.collection.bind('reset', self.render);
	},

	events: {
		"click .add" : "goAdd",
		"click .sortDistance" : "sortDistance",
		"click .sortCity" : "sortCity",
		"click .settings" : "goSettings",
		"vmousedown li" : "highlightItem",
		"vmouseup li" : "unhighlightItem",
		"vmousedown .add" : "highlightAdd",
		"vmouseup .add" : "unhighlightAdd",
		"vmousedown .settings" : "highlightSettings",
		"vmouseup .settings" : "unhighlightSettings"
	},

	render: function() { 
		var self = this;
		var renderedContent = this.template();
		$("ul#placeList").html("");
		self.list = "";
		self.currentCity = "";
		window.collection = this.collection;
		console.log("Now in the view...");
		console.log(this.collection);
		
		if (this.collection.sortMode == "city") {
			$(".sortCity").addClass("sortActive").removeClass("sortInactive");
			$(".sortDistance").addClass("sortInactive").removeClass("sortActive");
				this.collection.each(function(place) {
					if (place.get("location")["city"] != self.currentCity) {
						self.currentCity = place.get("location")["city"];
						self.list += "<li class='locationDivider'><div class='actAsTableCell verticalCenter'>" + self.currentCity + ", " + place.get("location")["state"] + "</div></li>";
					}

					self.list += self.renderStandardListItem(place);
				});

				$("ul#placeList").html(self.list);
		}

		if (this.collection.sortMode == "distance") {
			$(".sortDistance").addClass("sortActive").removeClass("sortInactive");
			$(".sortCity").addClass("sortInactive").removeClass("sortActive");
			console.log("sorting by distance...");
				var distanceMarker = null;
				this.collection.each(function(place) {
					if (place.get("location").distance < 25) {
						if (distanceMarker == null) {
							distanceMarker = "near";
							self.list += "<li class='locationDivider'><div class='actAsTableCell verticalCenter'>Near by</div></li>";
						}
						self.list += self.renderNearDistanceListItem(place);
					}

					if (place.get("location").distance > 25) {
						if (distanceMarker == "near" || distanceMarker == null) {
							distanceMarker = "far";
							self.list += "<li class='locationDivider'><div class='actAsTableCell verticalCenter'>Far from here</div></li>";
						}
						self.list += self.renderFarDistanceListItem(place);
					}

				});

			$("ul#placeList").html(self.list);
		}
		
		$("ul#placeList").listview("refresh");
		
		$(this.el).html(renderedContent);
	},
	
	postRender: function(){
		var listSortHeight = $("#listSort").height();
		$("#confirmationMessage").css({
			"height" : listSortHeight,
			"margin-top" : -listSortHeight
		});
		
		if (this.options.action == "delete"){
			$(".message").html("You removed "+this.options.place);
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);
		}
		
		if (this.options.action == "markasdone"){
			$(".message").html("Alright! That's one more in the books.");
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);
		}
		
		if (this.options.action == "saved") {
			$(".message").html("Saved to your list!");
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);		
		}
		
		if (this.options.action == "edited") {
			$(".message").html("Changed saved!");
			$("#confirmationMessage").css("display","table").delay(2000).fadeOut(750);		
		}
	},
	
	highlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");
	},
	
	unhighlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#ffffff");
	},
	
	highlightAdd: function(e) {
			util.highlightOnVMouseDown(e, "add");
	},
	
	unhighlightAdd: function(e) {
			util.unhighlightOnVMouseUp(e, "add");
	},
	
	highlightSettings: function(e) {
			util.highlightOnVMouseDown(e, "settings");
	},
	
	unhighlightSettings: function(e) {
			util.unhighlightOnVMouseUp(e, "settings");
	},

	renderStandardListItem: function(place) {
		window.place = place;
		return "<li data-icon='false' class='non_theme placeListItem'><a href='#mylocation/" + place.id + "' data-transition='slide'><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("location")["city"] + " ," + place.get("location")["state"] + "</span><span class='listingDetail'>" + place.get("categories")[0].name + "</span><div class='dblArrow'><img src='img/dbl_arrow.png' alt='View this place' /></div><div class='recommendedBy'><span class='recommendedByName'>Recommended by " + place.get("referrer") + "</span></div></a></li>";
	},

	renderNearDistanceListItem: function(place) {
		var distance = Math.round(place.get("distance") * 10) / 10;
		return "<li data-icon='false' class='placeListItem'><a href='#mylocation/" + place.id + "' data-transition='slide'><span class='distance'>" + distance + " mi</span><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("categories")[0].name + "</span><div class='dblArrow'><img src='img/dbl_arrow.png' alt='View this place' /></div><div class='recommendedBy'><span class='recommendedByName'>Recommended by "+place.get("referrer")+"</span></div></a></li>";
	},

	renderFarDistanceListItem: function(place) {
		return "<li data-icon='false' class='placeListItem'><a href='#mylocation/" + place.id + "' data-transition='slide'><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("location")["city"] + " ," + place.get("location")["state"] + "</span><span class='listingDetail'>" + place.get("categories")[0].name + "</span><div class='dblArrow'><img src='img/dbl_arrow.png' alt='View this place' /></div><div class='recommendedBy'><span class='recommendedByName'>Recommended by " + place.get("referrer") + "</span></div></a></li>";
	},

	sortCity: function() {
		$(".sortCity").addClass("sortActive").removeClass("sortInactive");
		$(".sortDistance").addClass("sortInactive").removeClass("sortActive");
		this.collection.getByCity();
	},

	sortDistance: function() {
		$(".sortDistance").addClass("sortActive").removeClass("sortInactive");
		$(".sortCity").addClass("sortInactive").removeClass("sortActive");
		this.collection.getByDistance();
	},
	
	goAdd: function() {
		App.navigate("#findPlace", {
			trigger: true
		});
	},
	
	goSettings: function() {
		App.navigate("#settings", {
			trigger: true
		});
	}

});

window.AddItemView = Backbone.View.extend({
	initialize: function() {
		console.log("initialize AddItemView");
		this.template = _.template($('#addItem-template').html());
		console.log(this.model);
		var placeID = this.model.id;
		this.model = new Place();
		var fetchUrl = "https://api.foursquare.com/v2/venues/"+placeID+"?client_id=AESY1ENXBRKZXCNFDUDR2R1WFGVLM2TQN2301V3FMUGW1BC2&client_secret=T4YY0SSSHX2MGRZHKH5GXC4XZAURILN1BFY2NAXV2ELMPJAC&v=20130101";
		console.log(fetchUrl);
		this.model.fetch(false,{url:fetchUrl});
		window.addModel = this.model;
	},

	render: function() {
		var renderedContent  = this.template(this.model.toJSON());
		$(this.el).html(renderedContent);
	
		setTimeout(function() {
		        var windowHeight = $("html").height();
				var headerHeight = $("#header").height();
				var placeInfoHeight = $("#placeInfo").height();
				var placeFeedbackHeight = windowHeight - (headerHeight+placeInfoHeight);
				
				console.log("#placeFeedback should be: " + placeFeedbackHeight);
				$("#placeFeedback").height(placeFeedbackHeight);
		    }, 0);
		
		return this;
	},
	
	events: {
		"submit #recommendedPlaceFeedback": "savePlace",
		"click .back" : "goBack",
		"click .edit" : "editPlace",
		"vmousedown .back" : "highlightBack",
		"vmouseup .back" : "unhighlightBack",
		"vmousedown .styledSubmit" : "highlightSubmit",
		"vmouseup .styledSubmit" : "unhighlightSubmit"
		},

	savePlace: function(e) {
		e.preventDefault();
		console.log("Go save...");
		var geopoint = new Parse.GeoPoint({
			latitude: this.model.get("location").lat, 
			longitude: this.model.get("location").lng
			});
		console.log(geopoint);			
		this.model.set({
			"user" : Parse.User.current(),
			"notes" : $("#notes").val(), 
			"referrer" : $("#recommendedBy").val(),
			"status" : "not_tried",
			"geo" : geopoint,
			"fs_id" : this.model.id,
			"sortableCity" : this.model.get("location").city.replace(/\s+/g, '') + this.model.get("location").state
		});
		delete this.model.id;
		this.model.save(null, {
		    success: function(response) {
		        console.log("success");
				window.App.navigate("#home/saved", {trigger:true});
		    },
		    error: function(response, e) {
		        console.log(e);
		    }
		});
	},
	
	goBack: function() {
		window.history.back();
	},
	
	highlightBack: function(e) {
			util.highlightOnVMouseDown(e, "back");
	},
	
	unhighlightBack: function(e) {
			util.unhighlightOnVMouseUp(e, "back");
	},
	
	highlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");		
	},	
	
	unhighlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#1cbbb4");		
	},
	
	editPlace: function() {
		window.App.navigate("#editPlace", {trigger:true});
	}
});

window.EditPlaceView = window.AddItemView.extend({
	initialize: function() {
		console.log("initialize editPlaceView");
		this.template = _.template($('#addItem-template').html());
	},
	
	events: {
		"submit #recommendedPlaceFeedback": "savePlace",
		"click .back" : "goBack",
		"vmousedown .back" : "highlightBack",
		"vmouseup .back" : "unhighlightBack",
		"vmousedown .styledSubmit" : "highlightSubmit",
		"vmouseup .styledSubmit" : "unhighlightSubmit"
	},
	
	savePlace: function(e) {
		e.preventDefault();
		this.model.set({
			"notes" : $("#notes").val(), 
			"referrer" : $("#recommendedBy").val()
		});

		this.model.save(null, {
		    success: function(response) {
		        console.log("success");
				window.App.navigate("#home/edited", {trigger:true});
		    },
		    error: function(response, e) {
		        console.log(e);
		    }
		}); 
	},
	
	goBack: function() {
		window.history.back();
	},
	
	highlightBack: function(e) {
			util.highlightOnVMouseDown(e, "back");
	},
	
	unhighlightBack: function(e) {
			util.unhighlightOnVMouseUp(e, "back");
	},

	highlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");		
	},	

	unhighlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#1cbbb4");		
	}
	
});

window.FindPlaceView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#findPlace-template').html());
	},

	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		var input = $('#location', this.el).get(0);
		var options = {
			types: ['(cities)']
		};
		autocomplete = new google.maps.places.Autocomplete(input, options);
		
		if (Parse.User.current().get("city")){
			$('#location', this.el).val(Parse.User.current().get("city") + ", " + Parse.User.current().get("state"));
		}

		return this;
	},
	
	postRender: function() {
		var self=this;
		console.log("loaded");
		$("#searchBox").focus(function(){
			$(this).css("color","#000000");
		});
	},

	events: {
		"submit form#searchBar": "processForm",
		"click li.result": "saveItem",
		"click .cancel" : "cancelAdd",
		"focus #searchBox" : "clearSearchField",
		"vmousedown .cancel" : "highlightCancel",
		"vmouseup .cancel" : "unhighlightCancel",
		"vmousedown li" : "highlightItem",
		"vmouseup li" : "unhighlightItem",
		"vmousedown .styledSubmit" : "highlightSubmit",
		"vmouseup .styledSubmit" : "unhighlightSubmit"
	},

	setLocation: function(e) {
		$("#searchLocationInput").hide();
		this.setLocation = $("#location").val();
		$("#searchLocation").html(this.setLocation).show();
	},

	drawList: function(collection) {
		$("ul#resultsList").empty();
		window.testplace = collection[0];
		collection.each(function(place) {
			if (!(place.get("location")["address"] = place.get("location")["address"])) {
				place.get("location")["address"] = "";
			}

			if (place.get("categories").length == 0) {
				place.category = "";
			} else {
				place.category = place.get("categories")[0]["name"];
			}

			$("ul#resultsList").append("<li class='result' data-id='" + place.cid + "'><span class='listingName'>" + place.get("name") + "</span><span class='listingDetail'>" + place.get("location")["address"] + "</span><span class='listingDetail'>" + place.category + "</span></li>");
		});
		
		$("ul#resultsList").listview("refresh");
		
		setTimeout(function(){
			var findContainerHeight = $("#findContainer").height();
			console.log($("#findContainer").height());
			var findContainerTopPadding = $("#findContainer").css("padding-top");
			console.log(findContainerTopPadding);
			$("#resultsContainer").css("padding-top", findContainerHeight+parseInt(findContainerTopPadding, 10));
			console.log($("#resultsContainer"));
		},0);		
	},

	processForm: function(e) {
		e.preventDefault();
		var self = this;
		this.querystring = $("#searchBox").val(); //get the query
		this.loc = $("#location").val();
		self.runQuery(this.querystring, this.loc);

	},

	runQuery: function(querystring, loc) {
		var self = this;
		self.collection = new Places(null, {
			searchterm: querystring,
			loc: loc
		}); //create a new collection, passing the query to the Foursquare URL
		window.searchresults = self.collection;
		self.collection.fetch({
		  success: function(collection) {
		  },
		  error: function(collection, error) {
		    // The collection could not be retrieved.
		  }
		});
		self.collection.bind('reset', function(collection) {
			self.drawList(collection);
		});
	},

	saveItem: function(e) {
		console.log("going to save");
		window.item = $(e.currentTarget).data("id");
		window.newplace = this.collection.get(window.item);
		App.navigate("#add", {
			trigger: true
		});
	},

	onClose: function() {
		this.model.unbind("change", this.render);
	},
	
	cancelAdd: function() {
			window.searchresults = null;
			App.navigate("#myplaces", {
				trigger: true
			});
	},
	
	clearSearchField: function() {
		if ($("#searchBox").val() == "What's the place?") {
			$("#searchBox").val("");
		}
	},
	
	highlightCancel: function(e) {
			util.highlightOnVMouseDown(e, "cancel");
	},
	
	unhighlightCancel: function(e) {
			util.unhighlightOnVMouseUp(e, "cancel");
	},
	
	highlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");		
	},	
	
	unhighlightSubmit: function(e) {
		$(e.currentTarget).css("backgroundColor", "#1cbbb4");		
	},
	
	highlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#fd6a5b");
	},

	unhighlightItem: function(e){
		$(e.currentTarget).css("backgroundColor", "#ffffff");
	}

});

window.SettingsView = Backbone.View.extend({

	initialize: function() {
		this.template = _.template($('#settings-template').html());
	},
	
	events: {
		"click #logout" : "logOut",
		"click .back" : "goBack"
	},
	
	render: function() {
		var renderedContent = this.template();
		$(this.el).html(renderedContent);
		return this;
	},
	
	logOut: function() {
		console.log("go log out");
		Parse.User.logOut();
		App.navigate("#login", {
			trigger: true
		});
	},
	
	goBack: function() {
		window.history.back();
	}
});
