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
// <script src="https://unpkg.com/@dfuse/client"></script>

// 3. Create the client
const client = dfuseClient.createDfuseClient({
	apiKey: 'web_4605956e15570c86603893d01083b10a',
	network: 'mainnet.eos.dfuse.io'
});

// 4. Stream your first results
// Let’s first define the GraphQL operation, as a string, that we will use to perform GraphQL subscription.Define what you want
// You must use a `$cursor` variable so stream starts back at last marked cursor on reconnect!
const operation = `subscription($cursor: String!) {
	searchTransactionsForward(query:"receiver:eosio.token action:transfer -data.quantity:'0.0001 EOS'", cursor: $cursor) {
		undo cursor
		trace { id matchingActions { json } }
	}
}`;

// Next, you create the GraphQL subscription to stream transfers as they come.
// You can combine the dfuse client instance we created in step 3 with the GraphQL document we defined above in a main function:

async function main() {
	const stream = await client.graphql(operation, (message) => {
		if (message.type === 'data') {
			const { undo, cursor, trace: { id, matchingActions } } = message.data.searchTransactionsForward;
			matchingActions.forEach(({ json: { from, to, quantity } }) => {
				const paragraphNode = document.createElement('li');
				paragraphNode.innerText = `Transfer ${from} -> ${to} [${quantity}]${undo ? ' REVERTED' : ''}`;

				document.body.prepend(paragraphNode);
			});

			// Mark stream at cursor location, on re-connect, we will start back at cursor
			stream.mark({ cursor });
		}

		if (message.type === 'error') {
			const { errors, terminal } = message;
			const paragraphNode = document.createElement('li');
			paragraphNode.innerText = `An error occurred ${JSON.stringify({ errors, terminal })}`;

			document.body.prepend(paragraphNode);
		}

		if (message.type === 'complete') {
			const paragraphNode = document.createElement('li');
			paragraphNode.innerText = 'Completed';

			document.body.prepend(paragraphNode);
		}
	});

	// Waits until the stream completes, or forever
	await stream.join();
	await client.release();
}

// 5. Full Working Examples
main().catch(error => console.log('Unexpected error', error));

