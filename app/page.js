"use client";

import { useState, useEffect } from 'react';
import { client, databases } from './appwrite';

const databaseId = 'messages';  // Your database ID
const collectionId = 'msg'; // Your collection ID

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setMessages(response.documents);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates
    const unsubscribe = client.subscribe(`databases.${databaseId}.collections.${collectionId}.documents`, response => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        setMessages(prevMessages => [...prevMessages, response.payload]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = async () => {
    try {
      await databases.createDocument(databaseId, collectionId, 'unique()', {
        senderId: 'user1',  // Replace with dynamic user IDs
        receiverId: 'user2',  // Replace with dynamic user IDs
        message: newMessage,
        timestamp: new Date().toISOString(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        {messages.map((msg) => (
          <div key={msg.$id}>
            <p><strong>{msg.senderId}</strong>: {msg.message} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em></p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
