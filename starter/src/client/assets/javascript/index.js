// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
	track_id: undefined,
	track_name: undefined,
	player_id: undefined,
	player_name: undefined,
	race_id: undefined,
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	console.log("Getting form info for dropdowns!")
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
			store.track_id = target.id
			store.track_name = target.innerHTML
		}

		// Racer form field
		if (target.matches('.card.racer')) {
			handleSelectRacer(target)
			store.player_id = target.id
			store.player_name = target.innerHTML
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate()
		}

		console.log("Store updated :: ", store)
	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}

// ^ PROVIDED CODE ^ DO NOT REMOVE

// BELOW THIS LINE IS CODE WHERE STUDENT EDITS ARE NEEDED ----------------------------
// TIP: Do a full file search for TODO to find everything that needs to be done for the game to work

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
	console.log("in create race")

	// render starting UI
	renderAt('#race', renderRaceStartView(store.track_name))

	try{
		const {track_id, player_id}= store;
	// Get player_id and track_id from the store
	
	// call the asynchronous method createRace, passing the correct parameters
	const race = await createRace(player_id,track_id)

	// update the store with the race id in the response
	console.log("RACE: ", race)
	store.race_id = race.ID ;
	console.log("RACE Id: ", store.race_id)


	
	
	// The race has been created, now start the countdown
	//call the async function runCountdown
	await runCountdown()

	// call the async function startRace
	await startRace(store.race_id)
	
	await runRace(store.race_id)

}catch(error){
	console.log(error.message)
}
}
	// call the async function runRace

async function runRace(raceID) {
	return new Promise(resolve => {
		
	// use Javascript's built in setInterval method to get race info (getRace function) every 500ms
		const raceInterval =setInterval(async function (){
			try{
			  const result = await getRace(raceID)
		
	/* 
		if the race info status property is "in-progress", update the leaderboard 

	*/
	if(result.status==="in-progress"){
		renderAt('#leaderBoard', raceProgress(result.positions))
	//if the race info status property is "finished"
	}else if(result.status==="finished"){
		clearInterval(raceInterval) // to stop the interval from repeating
		renderAt('#race', resultsView(result.positions)) // to render the results view

		resolve(result) // resolve the promise
	}
}catch(error){
	clearInterval(raceInterval)
	console.log(error.message)
}
	},500);
	})
	

	
 
	// remember to add error handling for the Promise
}

async function runCountdown() {
		// wait for the DOM to load
		try {

		await delay(1000)
		let timer = 3
		
		return new Promise(resolve => {
			// count down once per second
			const countDownInterval =setInterval(function(){
				document.getElementById('big-numbers').innerHTML = --timer
			

			// run this DOM manipulation inside the set interval to decrement the countdown for the user
			

			// when the setInterval timer hits 0, clear the interval, resolve the promise, and return
			if (timer<=0){
				clearInterval(countDownInterval)
				resolve()
			}
		},1000)
		})
	} catch(error) {
		console.log("error in counter"+error);
	}
}

function handleSelectRacer(target) {
	console.log("selected a racer", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')
}

function handleSelectTrack(target) {
	console.log("selected track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if (selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')	
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	// Invoke the API call to accelerate
	accelerate(store.race_id)
	.then(()=>
	console.log("accelerate button clicked!"))
	.catch((error)=> console.log(error.message))
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer
	
	return `<h4 class="card racer" id="${id}">${driver_name} <br> SPEED: ${top_speed}m/s <br> a: ${acceleration}m/s² <br> Handling: ${handling} </h3>`}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `<h4 id="${id}" class="card track">${name}</h4>`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track_name) {
	return `
		<header>
			<h1>Race: ${track_name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	let userPlayer = positions.find(e => e.id === parseInt(store.player_id));
	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1);
	userPlayer.driver_name += " (you)"
	let count = 1
  
	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			<h3>Race Results</h3>
			<p>The race is done! Here are the final results:</p>
			${results.join('')}
			<a href="/race">Start a new race</a>
		</main>
	`
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id === parseInt(store.player_id))
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<table>
			${results.join('')}
		</table>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:3001'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

//  Make a fetch call (with error handling!) to each of the following API endpoints 

async function getTracks() {
	console.log(`calling server :: ${SERVER}/api/tracks`)
	try{
	const response =await fetch(`${SERVER}/api/tracks`,{
		method:"GET"
	})
	return await response.json()
}catch(error){
	console.log("there is error in getTracks"+error.message)
}

}

async function getRacers() {
	try{
	const response = await fetch(`${SERVER}/api/cars`,{
		method:"GET"
	}
	)
	return await response.json()

}catch(error){
	console.log("there is an error in getRacers"+ error.message)
}
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err))
}

async function getRace(id) {
	try{
		const response =await fetch(`${SERVER}/api/races/${id}`,{
		method:"GET",
	})
	return await response.json()
	}catch(error){
		console.log("there is an error in getRace"+error.message)
	}
}

async function startRace(id) {
	await fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.then(res => console.log("selected"))
	.catch(err => console.log("Problem with getRace request::", err))
}

async function accelerate(id) {
	try{
		await fetch(`${SERVER}/api/races/${id}/accelerate`,{
			method:"POST",
			...defaultFetchOpts(),

		})
		
	}catch(error){
		console.log("there is an error in accelerate"+error.message)
	}
	
	
}
