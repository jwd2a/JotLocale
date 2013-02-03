//THIS IS THE HUB VERSION

window.JotLocale = Backbone.Router.extend({
	routes: {
	'' : 'checkLogin',
	'myplaces' : 'myplaces',
	'searchresults/:query/location/:location' : 'searchresults',
	'home/:action(/:placename)' : 'myplaces',
	'locationdetail/:id' : 'locationdetail',
	'register' : 'register',
	'myplaces/:action(/:placename)' : 'myplaces',
	'login' : 'login',
	'mylocation/:id' : 'mylocation',
	'add' : 'addItem',
	'findPlace' : 'findPlace',
	'editPlace' : 'editPlace',
	'settings' : 'settings'
	},
	
	initialize: function() {
		
	},
	
	login: function() {
		this.changePage(new LoginView({}));
	},
	
	checkLogin: function(){
		console.log("checking login");
		if(!Parse.User.current()){
			window.App.navigate("#login", {trigger:true});
		}
		else {
			window.App.navigate("#myplaces", {trigger:true});
		}
		
		
	},
	
	mylocation: function(id) {
		console.log(id);
		var place = window.collection.get(id);
		console.log(place);
		this.changePage(new MyLocationDetailView({model: place}), "slide");
	},
	
	register: function(){
		this.changePage(new RegisterView({}));

	},
	
	myplaces: function(action, place) {
		console.log("my places route");
		if (!action){
			var action = "";
			var place = "";
		}
		var myPlaceList = new SavedPlaces();
		var self=this;
		myPlaceList.getByCity();
		self.changePage(new MyPlacesView({
			collection: myPlaceList,
			action:action,
			place:place
		}));
	},	
	
	addItem: function() {
		if (!window.newplace) {
		window.newplace = new compactPlace({});
		}
		this.changePage(new AddItemView({model:window.newplace}), "slide");
	},
	
	findPlace: function() {
		this.changePage(new FindPlaceView({}), "flip");
	},
	
	editPlace: function(){
		this.changePage(new EditPlaceView({model:window.loc}), "flip");
	},
	
	settings: function() {
		this.changePage(new SettingsView({}), "fade");
	},	

	changePage:function (view, transition) {
			this.currentView = view;
	        $(view.el).attr('data-role', 'page');
	        view.render();
	        $('body').append($(view.el));
	        $.mobile.changePage($(view.el), {changeHash:false, transition: transition});
			setTimeout(function() {
			       if (view.postRender) {
				        view.postRender();
				}
			}, 0);
			
	}
	
});

