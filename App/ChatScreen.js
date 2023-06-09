import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet,Linking } from 'react-native';
import { auth } from '../config/firebase';
import { getDatabase, ref, onValue, push } from 'firebase/database';
import { dd, nme2 } from './JoinRoom';
const db = getDatabase();
import Icon from 'react-native-vector-icons/FontAwesome';

const handleCameraRedirect = () => {
  Linking.openURL('https://www.rapidtables.com/tools/camera.html');
}

function Message({ item }) {
  const isCurrentUser = item.user === auth.currentUser.email;
  return (
    <View style={[styles.message, isCurrentUser ? styles.currentUserMessage : null]}>
      <Text style={[styles.user]}>
        {item.user2}
      </Text>
      <Text style={[styles.text, isCurrentUser ? styles.currentUserText : null]}>
        {item.text}
        </Text>
      <Text style={[styles.date, isCurrentUser ? styles.currentUserDate : null]}>
        {new Date(item.createdAt).toLocaleTimeString()}
       
      
      </Text>
      
    </View>
  );
}

 function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    onValue(ref(db, `rooms/${dd}/messages`), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMessages(Object.values(data));
      }
    });
  }, []);

  function sendMessage() {
   /* onValue(ref(db, `rooms/${dd}/${uid}`), (snapshot) => {
      const namee = snapshot.val();})*/
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        user2: nme2,
        user:auth.currentUser.email,
        createdAt: new Date().toISOString(),
      };
      push(ref(db, `rooms/${dd}/messages`), newMessage);
      setMessage('');
    }
  }


 
  function renderItem({ item }) {
    return <Message item={item} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.messagesContainer}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity  onPress={handleCameraRedirect}>
          <Icon name="camera" size={25} color="#999" style={styles.cameraIcon} />
        </TouchableOpacity>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message here"
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  
  messagesContainer: {
    flex: 1,
  },
  message: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingRight:20
  },
  text: {
    fontSize: 16,
  },
  date: {
    fontSize: 8,
    color: '#666',
    
    marginLeft: 5,
    alignSelf: 'flex-end',
  },
  currentUserMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  currentUserText: {
    color: '#000',
  },
  currentUserDate: {
    color: '#444',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  cameraIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    color: 'blue',}
    ,
    user:{
      fontSize: 12,
      color: 'green',
      textDecorationStyle: 'solid',
      underline: true,
      alignSelf: 'flex-start',
    }
  })
export {ChatScreen};