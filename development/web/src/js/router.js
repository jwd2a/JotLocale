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
		this.loginView = new LoginView({});
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
		console.log("myplaces route");
		var myPlaceList = new SavedPlaces();
		myPlaceList.fetch({
			type:"GET",
			contentType:"application/JSON",
			headers:{"X-CloudMine-ApiKey": "b0237dff1dbd4dd18e966a5cccfb06d1"}
		});
		this.changePage(new MyPlacesView({collection: myPlaceList}));
		
	},
	
	addItem: function() {
		if (!window.newplace) {
		window.newplace = new Place({});
		}
		this.changePage(new AddItemView({model:window.newplace}), "flip");
	},
	
	findPlace: function() {
		//var findPlaceView = new FindPlaceView({});
		//window.appView.showView(findPlaceView);
		this.changePage(new FindPlaceView({}), "slide");
	},

	changePage:function (view, transition) {
			//if (this.currentView) {
		    //   this.currentView.close();
			//}
			this.currentView = view;
	        $(view.el).attr('data-role', 'page');
	        view.render();
	        $('body').append($(view.el));
	        $.mobile.changePage($(view.el), {changeHash:false, transition: transition});
	}
	
});

