var	player, currentVideo, previousCaption,
	timeInterval = null;


(function () {
	var urlId = getAllUrlParams().id;

	if (urlId === undefined) {
		console.log("undefined id");
		urlId = 0;
	} else if (urlId >= global_videos.length || urlId < 0) {
		console.log("inValid id");
		urlId = 0;
	} else {
		console.log(urlId);
	}
	currentVideo = global_videos[urlId];
})();

//insert data into html <ul> element
(function () {
	var ulElement = document.getElementById("subtitleList"),
		i, liElement;
	for (i = 0;i < currentVideo.subtitle.length;i++) {
		liElement = document.createElement("li");
		liElement.innerHTML = currentVideo.subtitle[i].text;
		liElement.setAttribute("id",i);
		ulElement.insertBefore(liElement, null);
	}
	previousCaption = document.getElementById("0");
})();

//load Youtube IFrame Player API code asynchronously.
(function (){
	var tag = document.createElement("script"),
		firstScriptTag = document.getElementsByTagName("script")[0];

		tag.src = "https://www.youtube.com/iframe_api";
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
		height: '400',
		width: '50%',
		videoId: currentVideo.ytVideoId,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
};


function onPlayerReady(event) {
	console.log("player ready");
	//event.target.playVideo();
}

function onPlayerStateChange(event) {
	switch (event.data) {
		case YT.PlayerState.PLAYING:
			if (timeInterval == null) {
				timeInterval = setInterval(onTimeChange,500);
			}
			break;
		case YT.PlayerState.PAUSED:
			clearInterval(timeInterval);
			timeInterval = null;
			break;
		case YT.PlayerState.ENDED:
			clearInterval(timeInterval);
			timeInterval = null;
			break;
	}
}

function onTimeChange() {
	var	i, subtitle = currentVideo.subtitle,
		subtitleLength = subtitle.length,
		currentTime = player.getCurrentTime();

	for (i = 0; i < subtitleLength; i++) {
		if (subtitle[i].start <= currentTime && currentTime <= subtitle[i].end) {
			break;
		}
	}
	if (i == subtitleLength) {
		document.getElementById("video_caption").innerHTML = "";
	} else {
		document.getElementById("video_caption").innerHTML = subtitle[i].text;
		previousCaption.style.color = "initial";
		previousCaption = document.getElementById(i);
		previousCaption.style.color = "red";
	}
}

// source https://www.sitepoint.com/get-url-parameters-with-javascript/
// Example usage of getAllUrlParams()

// http://example.com/?product=shirt&color=blue&newuser&size=m
// getAllUrlParams().product; // 'shirt'
// getAllUrlParams().color; // 'blue'
// getAllUrlParams().newuser; // true
// getAllUrlParams().nonexistent; // undefined
// getAllUrlParams('http://test.com/?a=abc').a; // 'abc'
function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}