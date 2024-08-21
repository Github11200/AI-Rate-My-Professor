'use client'

import { Box, Button, Stack, TextField } from '@mui/material'
import { useState, KeyboardEvent } from 'react'

// Define the types for messages
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Home() {
  // Initialize state with a type annotation for messages and message
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState<string>('');

  const sendMessage = async () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ]);
    
    setMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      if (!res.body) {
        throw new Error('Response body is not available');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      const processText = async () => {
        const { done, value } = await reader.read();
        if (done) {
          // Finalize the last message
          setMessages((prevMessages) => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + result },
            ];
          });
          return;
        }
        result += decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + result },
          ];
        });
        await processText();
      };

      await processText();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle key press events
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents default form submission or newline
      sendMessage();
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={'column'}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                msg.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  msg.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{
              '& .MuiInputBase-input': {
                color: 'white', // Text color
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white', // Border color
                },
                '&:hover fieldset': {
                  borderColor: 'white', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white', // Border color when focused
                },
              },
            }}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
