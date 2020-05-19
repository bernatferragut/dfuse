// 1. Get a dfuse API Key
const APIK = 'web_4605956e15570c86603893d01083b10a';
const URL = 'https://dfuse-testing.netlify.app/';
console.log(URL);

fetch('https://auth.dfuse.io/v1/auth/issue', {
	method: 'POST',
	body: JSON.stringify({
		api_key: APIK
	}),
	headers: {
		'Content-Type': 'application/json'
	}
})
	.then((res) => res.json())
	.then(console.log); // Cache JWT (for up to 24 hours)

const TOKEN = {
	token: 'eyJhbGciOiJLTVNFUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiO…dBtiUKVJoZsUz9WsyyaFpc60LVBev1zgSXK755paZCKIdzMKw',
	expires_at: 1589990162
};

// 2. Adding the Client Library
// npm install @dfuse/client

// 3. Create the client