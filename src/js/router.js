//THIS IS THE HUB VERSION

window.JotLocale = Backbone.Router.extend({
	routes: {
	'' : 'checkLogin',
	'searchresults/:query/location/:location' : 'searchresults',
	'home' : 'myplaces',
	'locationdetail/:id' : 'locationdetail',
	'register' : 'register',
	'myplaces' : 'myplaces',
	'login' : 'login',
	'mylocation/:id' : 'mylocation',
	'add' : 'addItem',
	'findPlace' : 'findPlace'
	},
	
	initialize: function() {
		
	},
	
	tempFB: function() {
		this.changePage(new TempFBLogin({}));
	},
	
	checkLogin: function() {
		window.App.User = new User({});
		window.console.log("checking login");
		var loggedIn = window.App.User.checkLoginStatus();
	},
	
	login: function() {
		this.changePage(new LoginView({}));
	},
	
	mylocation: function(id) {
		var place = window.collection.get(id);
		this.changePage(new MyLocationDetailView({model: place}), "slide");
	},
	
	register: function(){
		this.changePage(new RegisterView({}));

	},
	
	myplaces: function() {
		var self=this;
		console.log("myplaces route");
		
		if (!(window.App.User)){
			self.checkLogin();
		}
		
		var myPlaceList = new SavedPlaces();

		if (window.App.User.get("lat")) { //fallback feature to handle instance where device has no geolocation (should this be city?)
			myPlaceList.getByDistance();
		}
		else {
			console.log("no city");
			myPlaceList.getByState();
		}
		
		this.changePage(new MyPlacesView({collection: myPlaceList}));
		
	},
	
	addItem: function() {
		if (!window.newplace) {
		window.newplace = new Place({});
		}
		this.changePage(new AddItemView({model:window.newplace}), "flip");
	},
	
	findPlace: function() {
		this.changePage(new FindPlaceView({}), "slide");
	},

	changePage:function (view, transition) {
			this.currentView = view;
	        $(view.el).attr('data-role', 'page');
	        view.render();
	        $('body').append($(view.el));
	        $.mobile.changePage($(view.el), {changeHash:false, transition: transition});
	}
	
});

