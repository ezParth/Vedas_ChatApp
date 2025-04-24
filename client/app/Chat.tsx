import { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import io from 'socket.io-client';

interface Message {
  text: string;
  time: string;
  sender: 'me' | 'other';
}

const socket = io('http://192.168.154.32:3000');

const screenWidth = Dimensions.get('window').width;

export default function Chat() {
  const [message, setMessage] = useState<string>('');
  const [chat, setChat] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('receive-message', (msg: Message) => {
      setChat((prev) => [...prev, { ...msg, sender: 'other' }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msg: Message = {
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'me',
      };
      setChat((prev) => [...prev, msg]);
      socket.emit('send-message', msg);
      setMessage('');
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.msgContainer,
        item.sender === 'me' ? styles.msgRight : styles.msgLeft,
      ]}
    >
      <Text
        style={[
          styles.msgText,
          item.sender === 'me' ? styles.sentText : styles.receivedText,
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.time,
          item.sender === 'me' ? styles.sentTime : styles.receivedTime,
        ]}
      >
        {item.time}
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/images/image.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <FlatList
          data={chat}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { width: screenWidth * 0.8 }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            placeholderTextColor="#666"
            multiline
            blurOnSubmit={false}
            returnKeyType="send"
            onSubmitEditing={() => {
              if (message.trim()) {
                sendMessage();
              }
            }}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Image source={require('../assets/images/sentIcon.png')} style={styles.sendIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    padding: 20,
    paddingTop: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 20,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2196F3',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  msgContainer: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  msgLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCF8C6',
  },
  msgRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#225736',
  },
  msgText: {
    fontSize: 16,
    color: '#fff',
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  time: {
    fontSize: 8,
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  sentTime: {
    color: '#ccc',
  },
  receivedTime: {
    color: '#000',
  },
});
