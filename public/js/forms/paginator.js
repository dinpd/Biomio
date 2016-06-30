/*
	App.Collections.PaginatedCollection = Backbone.Paginator.clientPager.extend({

		paginator_core: {
			// the type of the request (GET by default)
			type: 'GET',
			
			// the type of reply (jsonp by default)
			dataType: 'jsonp',
		
			// the URL (or base URL) for the service
			url: 'php/api.php/user-devices'
		},
		
		paginator_ui: {
			// the lowest page index your API allows to be accessed
			firstPage: 1,
		
			// which page should the paginator start from 
			// (also, the actual page the paginator is on)
			currentPage: 1,
			
			// how many items per page should be shown
			perPage: 3,
			
			// a default number of total pages to query in case the API or 
			// service you are using does not support providing the total 
			// number of pages for us.
			// 10 as a default in case your service doesn't return the total
			totalPages: 10,
			
			pagesInRange: 3
		},
		
		server_api: {
			// number of items displayed is controlled on the client
			// but can still use the server API to restrict 
			// what gets sent over the wire
			
			// // number of items to return per request/page
			// 'per_page': function() { return this.perPage },
			// 
			// // how many results the request should skip ahead to
			// 'page': function() { return this.currentPage },
			
			// field to sort by
			'sort': 'created',
			
			// custom parameters
			'callback': '?'
		},

		parse: function (response) {
			// Be sure to change this based on how your results
			// are structured
			var issues = response.data;
			return issues;
		}

	});

//************************************************************************
//************************************************************************
//************************************************************************

	App.Models.Item = Backbone.Model.extend({});


//************************************************************************
//************************************************************************
//************************************************************************

	App.Views.AppView = Backbone.View.extend({

		el : '#contentt',

		initialize : function () {

			var tags = this.collection;

			tags.on('reset', this.addAll, this);
			tags.on('all', this.render, this);
			
			tags.fetch({
				data: {cmd: 'user_devices'},
				success: function(){
					tags.pager();
				},
				silent:true
			});


		},
		addAll : function () {
			this.$el.empty();
			this.collection.each (this.addOne);
		},
		
		addOne : function ( item ) {
			var view = new App.Views.ResultView({model:item});
			$('#contentt').append(view.render().el);
		},

		render: function(){
		}
	});


//************************************************************************
//************************************************************************
//************************************************************************

	App.Views.ResultView = Backbone.View.extend({
		tagName : 'li',

		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
		},

		render : function () {
			var template = render('DeviceList', {});
			this.$el.html(template);
			return this;
		}
	});

//************************************************************************
//************************************************************************
//************************************************************************


	var paginatedItems = new App.Collections.PaginatedCollection();
	var app = new App.Views.AppView({collection: paginatedItems});
	var pagination = new App.Views.PaginationView({collection: paginatedItems});



//************************************************************************
//************************************************************************
//************************************************************************

//************************************************************************
//************************************************************************
//************************************************************************

	App.Views.PaginationView = Backbone.View.extend({

		events: {
			'click a.first': 'gotoFirst',
			'click a.prev': 'gotoPrev',
			'click a.next': 'gotoNext',
			'click a.last': 'gotoLast',
			'click a.page': 'gotoPage',
			'click .howmany a': 'changeCount',
			'click a.sortAsc': 'sortByAscending',
			'click a.sortDsc': 'sortByDescending',
			'click a.filter': 'filter'
		},

		tagName: 'aside',

		initialize: function () {

			this.collection.on('reset', this.render, this);
			this.$el.appendTo('#pagination');

		},
		render: function () {
			var template = render('paginator/UserDevices', {});
			this.$el.html(template);
		},

		gotoFirst: function (e) {
			e.preventDefault();
			this.collection.goTo(1);
		},

		gotoPrev: function (e) {
			e.preventDefault();
			this.collection.previousPage();
		},

		gotoNext: function (e) {
			e.preventDefault();
			this.collection.nextPage();
		},

		gotoLast: function (e) {
			e.preventDefault();
			this.collection.goTo(this.collection.information.lastPage);
		},

		gotoPage: function (e) {
			e.preventDefault();
			var page = $(e.target).text();
			this.collection.goTo(page);
		},

		changeCount: function (e) {
			e.preventDefault();
			var per = $(e.target).text();
			this.collection.howManyPer(per);
		},

		sortByAscending: function (e) {
			e.preventDefault();
			var currentSort = this.getSortOption();
			this.collection.setSort(currentSort, 'asc');
			this.collection.pager();
			this.preserveSortOption(currentSort);
		},

		getSortOption: function () {
			return $('#sortByOption').val();
		},

		preserveSortOption: function (option) {
			$('#sortByOption').val(option);
		},

		sortByDescending: function (e) {
			e.preventDefault();
			var currentSort = this.getSortOption();
			this.collection.setSort(currentSort, 'desc');
			this.collection.pager();
			this.preserveSortOption(currentSort);
		},
        
		getFilterField: function () {
			return $('#filterByOption').val();
		},

		getFilterValue: function () {
			return $('#filterString').val();
		},

		preserveFilterField: function (field) {
			$('#filterByOption').val(field);
		},

		preserveFilterValue: function (value) {
			$('#filterString').val(value);
		},

		filter: function (e) {
			e.preventDefault();

			var fields = this.getFilterField();
			

			var filter = this.getFilterValue();
			
			this.collection.setFilter(fields, filter);
			this.collection.pager();

			this.preserveFilterField(fields);
			this.preserveFilterValue(filter);
		}
	});
*/