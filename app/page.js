"use client";

import React, { useState, useEffect, useRef } from 'react';
import { client, databases } from './appwrite';
import { useSearchParams } from 'next/navigation';

const databaseId = 'messages';  // Your database ID
const collectionId = 'msg'; // Your collection ID

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef(null);

  const searchParams = useSearchParams();
  const senderId = searchParams.get('senderId');
  const receiverId = searchParams.get('receiverId');

  const scrollToBottom = () => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  };
  const scrollToTop = () => {
    chatBoxRef.current.scrollToBottom = chatBoxRef.current.scrollHeight;
  };

  useEffect(() => {
    // console.log(chatBoxRef.current.scrollTop);
    // console.log(chatBoxRef.current.scrollToBottom);
    // if(chatBoxRef.current.scrollTop==0){
    //   scrollToTop();
    // }
    if(chatBoxRef.current.scrollTop>0){
      // scrollToBottom();
      scrollToTop();

    }
    if(chatBoxRef.current.scrollToBottom<0){
      // scrollToTop();
      scrollToBottom();

    }

    const fetchMessages = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setMessages(response.documents);
        scrollToBottom();
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const unsubscribe = client.subscribe(`databases.${databaseId}.collections.${collectionId}.documents`, response => {
      if (response.events.includes('databases.*.collections.*.documents.*.create')) {
        setMessages(prevMessages => [...prevMessages, response.payload]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [messages]);

  // useEffect(() => {
  //   scrollToBottom();
  //   // scrollToTop();

  // }, [messages]);

  const sendMessage = async () => {
    if (!senderId || !receiverId) {
      alert('Both sender and receiver must be specified.');
      return;
    }

    try {
      const documentData = {
        senderId: senderId,
        receiverId: receiverId,
        message: newMessage,
        timestamp: new Date().toISOString(),
      };

      await databases.createDocument(databaseId, collectionId, 'unique()', documentData);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="container mt-5">
      {/* <h1 className="text-center mb-4">Real-Time Chat</h1> */}

      <div className="card">
        <div className="card-body chat-box" ref={chatBoxRef} style={{height: '600px', overflowY: 'auto'}}>
          {messages.map((msg) => (
            <div key={msg.$id || msg.timestamp} className={`mb-3 ${msg.senderId === senderId ? 'text-end' : ''}`}>
              <div className={`d-inline-block p-2 rounded ${msg.senderId === senderId ? 'bg-primary text-white' : 'bg-light'}`}>
                <p className="mb-0">{msg.message}</p>
                <small className="text-muted">{new Date(msg.timestamp).toLocaleTimeString()}</small>
              </div>
            </div>
          ))}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button className="btn btn-primary" onClick={sendMessage} disabled={!newMessage.trim()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
