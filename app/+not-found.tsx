import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Image  source={{uri : "https://i.pinimg.com/736x/33/4b/e0/334be0e84e1edad5dceeb427efac41ed.jpg"}} style={styles.movieImage} />
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
    paddingVertical: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  movieImage: {
    width: '100%',
    height: 240,
    borderRadius: 15,
  },
});
