import { Client, Databases, Account, Query, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('http://localhost:5009/v1') // Your Appwrite endpoint
    .setProject('realtime-testing'); // Your project ID

client.headers['X-Appwrite-Key'] = 'c7d4a6e9798af9160257a42a3aa70465734af5c01a13e31cc1016ad956a1ead5f4a82e21e929e3bb8c93996782942e92fafd9d3165467cb6fb8478a95ad3f6230f71e8c4385e16a2bd2ea60b9803c86f088600e9a3b19e0dcab733a012dee845e688cf26e888e0a4e41f3cb3e98ce7f2309d4166044f8bf5003333ecb4aa4dec'; // Replace with your actual API key

const databases = new Databases(client);
const account = new Account(client);

export { client, databases };


