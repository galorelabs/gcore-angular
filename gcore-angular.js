/*
 * The Official AngularJS wrapper for the GCORE API.
 * 
 */

angular.module('gcore', ['ngCookies'])


.factory('gcore', function($cookies, $cookieStore, $http) {
/***
 * This is a thin wrapper for the GCORE REST API. 
 */	


	var endpoint = 'http://api.gcore.galoretv.com';

	var self = {

		/** Properties **/
		endpoint : endpoint,
		
		/** Methods: Session **/

		/** Synactic sugars **/


		login : function(username, password) {
			return this.post_session(username, password);
		},
		
		/*** Utilities and Helpers ***/
		
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
	
		/******* API ******/
		
		/** POST /session **/
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

		
		/** DELETE /session **/
		delete_session: function() {
		},
		
		
		/********* POST systems/email **********************************/
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

});