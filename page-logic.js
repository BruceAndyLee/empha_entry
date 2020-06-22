document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById("to-index").onclick = function() {
		localStorage.removeItem("access_token");
		localStorage.removeItem("token_start");
		window.location.replace("http://82.146.41.50");
	}

	token = localStorage.getItem("access_token");
	console.log("window is " + window.innerWidth + "x" + window.innerHeight);
	if (token == null) {
		console.log("token is null");
		var at = getParameterByName('access_token');
		console.log("got new token " + at);
		var uid = getParameterByName('user_id');
		var expires_in = getParameterByName('expires_in');
		
		localStorage.setItem("access_token", at);
		localStorage.setItem("user_id", uid);
		localStorage.setItem("expires_in", expires_in);
		var token_start = new Date();
		localStorage.setItem("token_start", JSON.stringify(token_start));
		token = at;
	}
	var uid = localStorage.getItem("user_id");
	console.log("gonna try get friend with access_token: " + token);
	$.ajax({
		url: 'https://api.vk.com/method/friends.get?&access_token=' + token +
			"&order=random&fields=photo_100"+ '&v=5.107',
		method: 'GET',
		dataType: 'JSONP',
		success: function(data) {
			if (data.response) {
				console.log(JSON.stringify(data.response));
				var ids = data.response.items;
				var new_count = data.response.count;
				console.log("the new count is " + new_count);
				if (new_count == 0) { // the bloke's no friends :(
					$("#users-div").hide();
					$("#msg-box").append("<p>Well, you don't seem to have any friends. Sorry to break it to you.</p>");
					return;	
				}
				
				users = data.response.items;
				var true_users = 0;
				for (var i = 0; i < new_count && true_users < 5; i++) {
					if (users[i].first_name == "DELETED") continue;
					if (users[i].deactivated) continue;

					$("#users-div").append("<div><image src=\"" + users[i].photo_100 + "\"></div>");
					$("#users-div").append("<div class=\"grid-item-wide\"><p>" + 
								users[i].first_name + " " + 
								users[i].last_name + "</p></div>");
					true_users++;
				}
			} else {
				console.log("Couldn't retreive friends");
				console.log("friends.get()::error:" + JSON.stringify());
			}
		}
	});

	$.ajax({
		url: 	'https://api.vk.com/method/users.get?user_ids=' + uid + 
			'&fields=photo_50&access_token=' + token + '&v=5.107',
		method: 'GET',
		dataType: 'JSONP',
		success: function(data) {
			if (data.response) {
				var user = data.response[0];
				console.log("logged user: " + JSON.stringify(data.response[0]));
				$("#user").text("Logged in as " + user.first_name + " " + user.last_name);
			} else {
				$("#user").text("Couldn't retreive the user info :(");
				console.log("users.get::error: " + JSON.stringify(data));
			}
		}
	});
});

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	url = url.replace('#', '?');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
	var result = regex.exec(url);
	if (!result) return null;
	if (!result[2]) return '';
	return decodeURIComponent(result[2].replace(/\+/g, ' '));
}

