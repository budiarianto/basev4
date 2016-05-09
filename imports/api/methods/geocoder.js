var geo = new GeoCoder({
  geocoderProvider: "google",
  httpAdapter: "https",
  apiKey: 'AIzaSyBumH-DbNQPmelehSliZzgbdT0ulHmfx98'
});

Meteor.methods({
	getAddress(latLng){
		check(latLng, Object);
		return geo.reverse(latLng.lat, latLng.lng);
	},
	getLocation(address){
		check(address, String);
		
//		console.log('address to convert', address);
		return geo.geocode(address);
	}
}); 