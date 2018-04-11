var youtubeExternalSubtitle,
	urlVideoId = getAllUrlParams().id;

//load Youtube IFrame Player API code asynchronously.
(function (){
	var tag = document.createElement("script"),
		firstScriptTag = document.getElementsByTagName("script")[0];
	
		tag.src = "https://www.youtube.com/iframe_api";
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

console.log("load script end");

if (urlVideoId === undefined) {
	console.log("undefined id");
	urlVideoId = 0;
} else if (urlVideoId >= global_videos.length || urlVideoId < 0) {
	console.log("inValid id");
	urlVideoId = 0;
} else {
	console.log(urlVideoId);
}

//supply subtitle by using 3rd party Js api https://github.com/siloor/youtube.external.subtitle
youtubeExternalSubtitle = new YoutubeExternalSubtitle.Subtitle(document.getElementById("player"), global_videos[urlVideoId].subtitle);

//insert data into html <ul> element
(function () {
	var ulElement = document.getElementById("subtitleList"),
		i, liElement,
		video = global_videos[urlVideoId]; //video id
	for (i = 0;i < video.subtitle.length;i++) {
		liElement = document.createElement("li");
		liElement.innerHTML = video.subtitle[i].text;
		ulElement.insertBefore(liElement, null);
	}
})();


//source https://www.sitepoint.com/get-url-parameters-with-javascript/
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

//Example of using getAllUrlParams()

//http://example.com/?product=shirt&color=blue&newuser&size=m
//getAllUrlParams().product; // 'shirt'
//getAllUrlParams().color; // 'blue'
//getAllUrlParams().newuser; // true
//getAllUrlParams().nonexistent; // undefined
//getAllUrlParams('http://test.com/?a=abc').a; // 'abc'

