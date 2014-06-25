/*
 * The Official AngularJS wrapper for the GCORE API.
 * 
 */

angular.module('gcore', ['ngCookies'])

.provider('$gcore', function() {

	/*** Configurable Properties ***/
    this.endpoint = 'https://api.gcore.galoretv.com';
    this.cookie_name = 'gcore_authentication';
    this.user_cookie_name = 'gcore_user';
    
    this.set_endpoint = function(endpoint) {
        this.endpoint = endpoint;
    };
    
    this.set_cookie_name = function(cookie_name) {
    	this.cookie_name = cookie_name;
    };
    
    this.set_user_cookie_name = function(user_cookie_name) {
    	this.user_cookie_name = user_cookie_name;
    };    

    /*** Actual object to return **/
    this.$get = function($cookies, $cookieStore, $http) {
        
    	/** objects to form closure with **/
    	var endpoint = this.endpoint;
    	var cookie_name = this.cookie_name;
    	var user_cookie_name = this.user_cookie_name;
        
        var self = {
        	
        	/*** Utilities and Helpers ***/
        	
        	endpoint: function() {
        		return endpoint;
        	},
        	
    		get_request_headers: function() {
			  var gcore_authentication = $cookieStore.get(cookie_name);
			  return {
		    		  Authorization : gcore_authentication, 
		    		  Accept : 'application/json',
		    		  "Content-Type": 'application/json'
		      };		
    		},
    		
    		url_params: function(hash) {
    			
    			if(Object.getOwnPropertyNames(hash).length !== 0) {
    				url = "?";
    				angular.forEach(hash, function(value, key){
    					url += key + "=" + value + "&";
    				});
    				url = url.substring(0, url.length - 1);
    			} else {
    				url = "";
    			}  			
    			return url;
    		},
    		
    		order_status: function() {
    			return [
    			        'canceled',
    			        'closed',
    			        'delivered',
    			        'for_verification',
    			        'invoiced',
    			        'new',
    			        'not_delivered', 
    			        'on_hold',
    			        'packed',
    			        'pending',
    			        'return_received',
    			        'shipped',
    			        'verified'    			        
    			];
    		},
    		
    		/** Cookie-related functions **/
    		
    		is_logged_in: function() {
    			if($cookieStore.get(cookie_name) != null) {
    				return true;
    			} else {
    				return false;
    			}   			
    		},
    		
    		get_logged_on_user: function() {
    			return $cookieStore.get(user_cookie_name);
    		},
    		
    		/** TODO: Connect with DELETE /session **/
    		logout: function() {
    			$cookieStore.remove(cookie_name);
    			$cookieStore.remove(user_cookie_name);
    		},
    		
    		/** Synactic sugars (API Alias) **/


    		login : function(username, password) {
    			return this.post_session(username, password);
    		},
    		
    		
    		/*** Generic API ***/
    		
    		
    		get: function(resource) {
    			return $http.get(
    				endpoint + resource,
    				{headers: self.get_request_headers()}
    			);
    		},  
    		
    		/****** 
    		post: function(resource) {
 
    		}, 
 
    		put: function(resource) {
 
    		}, 
    		

    		delete: function(resource) {
 
    		},     		    		
    		
    		*******/
    		
        	
        	/******* API 
        	 * 
        	 * Naming convention:
        	 * 
        	 * Assume that we have resource named "resources", we follow Rails naming convention at
        	 * http://guides.rubyonrails.org/routing.html,
        	 * except for "index", which becomes "list".
        	 * 
        	 * Any additional parameters will be included in the "params" hash. The "params" hash is optional.
        	 * 
        	 * 
        	 * GET /resources 			-> $gcore.list_resources(params);
        	 * POST /resources 			-> $gcore.create_resources(params);
        	 * GET /resources/:id 		-> $gcore.show_resources(id, params);
        	 * PUT /resources/:id 		-> $gcore.update_resources(id, params);
        	 * PUT /resources			-> $gcore.mass_update_resources(params);
        	 * DELETE /resources/:id 	-> $gcore.destroy_resources(id, params);
        	 * 
        	 * ******/
 
    		/*** Session ***/
    		post_session: function(username, password) {
    			return $http.post(
    				endpoint + "/session", 
    				JSON.stringify({username: username, password: password}),
    				{headers: self.get_request_headers()}
    			)	
    			.success(function(data, status, headers, config) {

    				//create session
    				user_id = data.model.user.id;
    				user_secret_token = data.model.user.secret_token;
    				$cookieStore.put(cookie_name, user_id + ":" + user_secret_token);
    				$cookieStore.put(user_cookie_name, data.model.user);
    			
    			});
    		},
    		
    		/*** Orders ***/
    		list_orders: function(params) {
    			
    			
    			var url = endpoint + "/sales_orders"; 
    			
    			url += self.url_params(params);

    			return $http.get(
    				url,
    				{headers: self.get_request_headers()}
    			);
    			
    		},
    		
    		show_orders: function(id, params) {
    			
    			var url = endpoint + "/sales_orders/" + id;
    			
    			if (params) {
    				url += self.url_params(params);
    			}
    			    			
    			return $http.get(
        				url,
        				{headers: self.get_request_headers()}
        			);
    		},
    		
    		update_orders: function(id, params) {
    			
    			var url = endpoint + "/sales_orders/" + id;
    			
    			return $http.put(
    					url,
    					params['_json'] ? JSON.stringify(params['_json'])  : JSON.stringify(params),
    					{headers: self.get_request_headers()}
    			);
    			
    			
    		},
    		
    		mass_update_orders: function(params) {
 
    			var url = endpoint + "/sales_orders";
    			
    			return $http.put(
    					url,
    					params['_json'] ? JSON.stringify(params['_json'])  : JSON.stringify(params),
    					{headers: self.get_request_headers()} 
    			);		
    		},
    		
    		
    		/*** Products ***/
    		list_products: function(params) {
    			
    			
    			var url = endpoint + "/stores/" + params['stores'] + "/products"; 
    			delete params['stores'];
    			
    			url += self.url_params(params);

    			return $http.get(
    				url,
    				{headers: self.get_request_headers()}
    			);
    			
    		},
    		
    		/*** Catalog Products ***/
    		
    		
    		
    		/*** Comments ***/
    		
    		delete_comments: function(id, params) {
    			
    			var url = endpoint + "/sales_orders/" + params['sales_orders_id'] + "/comments/" + id; 
    			delete params['sales_orders_id'];
    			
//    			return $http.delete(
//    					url,
//    					params['_json'] ? JSON.stringify(params['_json'])  : JSON.stringify(params),
//    					{headers: self.get_request_headers()}
//    			);
    			
    			
    		},
    		
    		/*** Systems ***/
    		create_email: function(params) {
    			
    			var url = endpoint + "/systems/email";
    			
    			return $http.post(
    					url,
    					params['_json'] ? JSON.stringify(params['_json']) : JSON.stringify(params),
    					{headers: self.get_request_headers()}
    			);   			    			
    		},
    		
    		//Syntactic sugar is goodd for the brain
    		send_email: function(params) {
    			return this.create_email(params);
    		}
    		
    		
        };
        
        return self;
    };


})

;

//hey, we can configure a provider!            
//.config(function($gcoreProvider){
//	$gcoreProvider.setEndpoint('http://qa.api.gcore.galoretv.com');
//});


//.factory('$gcore', function($cookies, $cookieStore, $http) {
/***
 * This is a thin wrapper for the GCORE REST API. 
 */	


//	var live_endpoint = 'http://qa.api.gcore.galoretv.com';
//	var qa_endpoint = 'http://api.gcore.galoretv.com';

//	var self = {

		/** Properties **
		
		environment: "live",
			
			
		endpoint : function() {
			if (self.environment == "live") {
				return live_endpoint;
			} else {
				return qa_endpoint;
			}
		},
		
		/** Methods: Session **
		

		/** Synactic sugars **


		login : function(username, password) {
			return this.post_session(username, password);
		},
		
		/*** Utilities and Helpers ***
		
		default_error_callback: function(data, status, headers, config) {
			console.log(data.message);
			alert(data.message);
		},
		
		get_request_headers: function() {
		  var gcore_authentication = $cookieStore.get('gcore_authentication');
		  return {
	    		  Authorization : gcore_authentication, 
	    		  Accept : 'application/json',
	    		  "Content-Type": 'application/json'
	     };		
		},
	
		/******* API ******
		
		/** POST /session **
		post_session: function(username, password) {
			return $http.post(
				endpoint + "/session", 
				JSON.stringify({username: username, password: password})
			)	
			.success(function(data, status, headers, config) {

				//create session
				user_id = data.model.user.id;
				user_secret_token = data.model.user.secret_token;
				$cookieStore.put('gcore_authentication', user_id + ":" + user_secret_token);
			
			})
			.error(function(data, status, headers, config)	{			

				self.default_error_callback(data, status, headers, config);	

			});
		},

		
		/** DELETE /session **
		delete_session: function() {
		},
		
		
		/********* POST systems/email **********************************
		post_systems_email: function(to, subject, body) {
			return $http.post(
				endpoint + '/systems/email',
				JSON.stringify({to: to, subject: subject, body: body}),
				{headers: self.get_request_headers()}
			)
			.error(function(data, status, headers, config)	{			
				self.default_error_callback(data, status, headers, config);	
			});	
		}
		

		 
	};

	return self;
	*/

//});