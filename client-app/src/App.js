import logo from "./logo.svg";
import "./App.css";
import axios from 'axios';
function App() {
	axios.get('https://localhost:44360/').then(result => console.log(result.data)).catch(err => console.log(err))
	.then(result => console.log(result.data))
	.catch(err => console.log(err))
	// axios.post('https://localhost:44360/token', {
	// 	username: 'Admin',
	// 	password: 'Admin1234.'
	// }).then(result => console.log(result.data))
	// .catch(err => console.log(err))
	// axios.get('https://localhost:44360/api/Value').then(result => console.log(result))
	// axios.post('https://localhost:44360/api/Account/Register', {
	// 	"UserName":"Renter1",
	// 	"Name":"Renter1",
	// 	"Email": "renter1@gmail.com",
	// 	"Password": "12012000Aa.",
	// 	"ConfirmPassword": "12012000Aa."
	// }).then(result => console.log(result)).catch(err => console.log(err))
	
  return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
  );
}

export default App;
