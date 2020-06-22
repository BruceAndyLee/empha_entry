document.addEventListener("DOMContentLoaded", function(event) {
//	localStorage.removeItem("access_token");
//	localStorage.removeItem("token_start");
	document.getElementById("implicit-flow-button").addEventListener("click", getTokenAndRedirect);

	var at = localStorage.getItem("access_token");
	var uid = localStorage.getItem("user_id");
	var longevity = parseInt(localStorage.getItem("expires_in"));
	var token_start = new Date(JSON.parse(localStorage.getItem("token_start")));
	var now = new Date();
	if (at != null && token_start != null) {
		var diff = processDateDiff(now, token_start);

		console.log("Checking the token: " + at);
		console.log("token_started " + token_start);
		console.log("now " + now);
		console.log("expires_in " + longevity);
		console.log("diff: " + diff);

		if (diff < longevity) {
			window.location.replace("http://82.146.41.50/page.html");
		} else {
			localStorage.removeItem("access_token");
			localStorage.removeItem("token_start");
		}
	} else {
		console.log("access token is not alright");
		console.log("token " + at);
		console.log("expires_in " + longevity);
		console.log("token_started " + token_start);
		localStorage.removeItem("access_token");
		localStorage.removeItem("token_start");
		$("#maintenance-box").text("access token not set, you need to authorize");
	}
});

function getTokenAndRedirect () {
	var url = 	"https://oauth.vk.com/authorize" +
			"?client_id=7474217" +
			"&redirect_uri=http://82.146.41.50/page.html" +
			"&scope=friends" +
			"&response_type=token" + 
			"&v=5.107";
	window.location.replace(url);
}

function processDateDiff(now, then) {
	return Math.trunc(Math.abs(now - then) / 1000);
}
