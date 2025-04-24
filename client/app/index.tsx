import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const [bounceValue] = useState(new Animated.Value(1));
  const router = useRouter();

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(bounceValue, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleLoginPress = () => {
    animateButton();
    router.push('/Login');
  };

  const handleSignupPress = () => {
    animateButton();
    router.push('/Signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat App</Text>

      <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
        <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: bounceValue }] }}>
        <TouchableOpacity style={[styles.button, styles.signupButton]} onPress={handleSignupPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ff5b77',
    marginBottom: 60,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    width: 250,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: '#ff5b77',
  },
  signupButton: {
    backgroundColor: '#ffc107',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
