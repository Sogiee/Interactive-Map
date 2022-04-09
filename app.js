// the start of my suffering

const intMap = {
	coordinates: [],
	businesses: [],
	map: {},
	markers: {},

// leaflet 

	buildMap() {
		this.map = L.map('map', {
		center: this.coordinates,
		zoom: 11,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: '15',
		}).addTo(this.map);

// you are here 

		const marker = L.marker(this.coordinates)
		marker
		.addTo(this.map)
		.bindPopup('<p1><b>You are here</b><br></p1>')
		.openPopup()
	},

// add business markers

	addMarkers() {
		for (var i = 0; i < this.businesses.length; i++) {
		this.markers = L.marker([
			this.businesses[i].lat,
			this.businesses[i].long,
		])
			.bindPopup(`<p1>${this.businesses[i].name}</p1>`)
			.addTo(this.map)
		}
	},
}

// im losing my mind
// my coords

async function myCoords(){
	const pos = await new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject)
	});
	return [pos.coords.latitude, pos.coords.longitude]
}

// foursquare is confusing

async function findFoursquare(business) {
	const options = {
		method: 'GET',
		headers: {
		Accept: 'application/json',
		Authorization: 'fsq3LSDaBAv5sLKLV40K2Qn+Frm+mvu1XYx9mpEtGQ/oKEQ='
		}
	}
	let limit = 5
	let lat = intMap.coordinates[0]
	let lon = intMap.coordinates[1]
	let response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.foursquare.com/v3/places/search?&query=${business}&limit=${limit}&ll=${lat}%2C${lon}`, options)
	let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
	return businesses
}
function findBusinesses(data) {
	let businesses = data.map((element) => {
		let location = {
			name: element.name,
			lat: element.geocodes.main.latitude,
			long: element.geocodes.main.longitude
		};
		return location
	})
	return businesses
}

// loading map 
window.onload = async () => {
	const coords = await myCoords()
	intMap.coordinates = coords
	intMap.buildMap()
}

// submit button is making me lose sanity

document.getElementById('submit').addEventListener('click', async(event) => {
	event.preventDefault()
	let business = document.getElementById('Businesses').value
	let data = await findFoursquare(business)
	intMap.businesses = findBusinesses(data)
	intMap.addMarkers()
})

// OH HEY IT WORKS