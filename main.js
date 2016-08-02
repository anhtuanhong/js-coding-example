/* 
	Javascript file for weather.html
 	Outputs elements for weather forecast
*/

$(document).ready(function(){
	
	var zip = $.urlParam('zip_code');
	var dater = $.urlParam('date'); 
	var key = "6ea7cf3bc006012f"; //weather api key
	var gMap = "http://maps.googleapis.com/maps/api/geocode/json?address="+zip+"&sensor=true"; //google zip code look-up
	var wwAPI = "http://api.wunderground.com/api/"+key+"/forecast10day/q/"+zip+".json"; //weather api
	var temperature = "F" //F or C;
	var forecastArray = []; //output array of 3 days of forecast
	var element = $('.container'); //parent element to be appended to

	$.when( $.ajax(gMap) , $.ajax(wwAPI) ).done( function( data, forecast ){
		var cityName = JSON.parse(data[2].responseText).results[0].address_components[1].long_name;
		var forecastDay = JSON.parse(forecast[2].responseText).forecast.simpleforecast.forecastday;
		console.log(forecastDay);
		var daterSplit = dater.split('/');

		for( i = 0; i < forecastDay.length; i++){
			
			if( forecastDay[i].date.month == daterSplit[0] && forecastDay[i].date.day == daterSplit[1] && forecastDay[i].date.year == daterSplit[2] ){
				for( j = 0; j <= 2; j++){
					if( j == 0 ){
						dayNamer = "Today";
					}else{
						dayNamer = forecastDay[i+j].date.weekday;
					}

					var temp = { dayName: dayNamer, dayImage: forecastDay[i+j].icon_url.replace('/k/', '/g/') , dayDesc: forecastDay[i+j].conditions, dayHigh:forecastDay[i+j].high, dayLow:forecastDay[i+j].low};
					forecastArray[j] = temp;
				}
			}
		}
	
		if( cityName != '' && forecastArray.length > 1){
			element.append( "<h1>Weather forcast for "+cityName+"</h1>");
			forecastArray.forEach( function(value){
				if( temperature == "F"){
					var dayHigh = value.dayHigh.fahrenheit;
					var dayLow = value.dayLow.fahrenheit;
				}else{
					var dayHigh = value.dayHigh.celsius;
					var dayLow = value.dayLow.celsius;
				}
				element.append( '<div id="'+value.dayName+'" class="dayHolder"><div class="dayTitle">'+value.dayName+':</div><div class="dayWeather"><img src="'+value.dayImage+'" /><div class="dayDesc"><p>'+value.dayDesc+'</p><p><b>'+dayHigh+'&deg;</b> / '+dayLow+'&deg; '+temperature+'</div></div></div>');
			});
		}else{
			console.log( error );
		}
		
	});

});

function forecastElement( dayName, dayImage, dayDesc, dayHigh, dayLow ) {
	this.dayName = dayName;
	this.dayImage = dayImage;
	this.dayDesc = dayDesc;
	this.dayHigh = dayHigh;
	this.dayLow = dayLow;

	return this;
}

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
}

