import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import axiosInstance from '~/lib/apiClient';
import { replaceIp } from '~/lib/helper';
import { ShowTime } from '~/lib/types';


const ShowTimeDetailsScreen = () => {
  const { showTimeId } = useLocalSearchParams<{ showTimeId: string }>();
  const [showTime, setShowTime] = useState<ShowTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter()

  useEffect(() => {
    const fetchShowTimeDetails = async () => {
      try {
        const res = await axiosInstance.get(`/showTime/getShowtime/${showTimeId}`);
        setShowTime(res.data.showtimes);
      } catch (err) {
        console.error('Error fetching showtime details:', err);
        setError('Failed to load showtime details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShowTimeDetails();
  }, [showTimeId]);

  const handleReserve = () => {

    console.log('Reserve button clicked');

};

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#b21f1f" />
        <Text style={styles.loadingText}>Loading showtime details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!showTime) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Showtime not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: replaceIp(showTime.movie.image, process.env.IP as string) }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle}>{showTime.movie.title}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.movieDetails}>
          🗓 {new Date(showTime.time).toLocaleDateString()} | 🕒 {new Date(showTime.time).toLocaleTimeString()}
        </Text>
        <Text style={styles.movieDetails}>📍 {showTime.room.name} ({showTime.room.type})</Text>
        <Text style={styles.movieDetails}>⏳ Duration: {showTime.movie.duration} mins</Text>
        <Text style={styles.movieDetails}>💵 Price: ${showTime.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.reserveButton} onPress={() => router.push(`/resrvationPage?showTimeId=${showTime._id}`)}
      >
        <Text style={styles.reserveButtonText}>Reserve Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom:80,
    backgroundColor: '#0f0f0f',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  poster: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  movieTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
  },
  movieDetails: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 8,
    fontWeight: '500',
  },
  reserveButton: {
    marginTop: 20,
    backgroundColor: '#b21f1f',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3, // Adds shadow on Android
    shadowColor: '#000', // Adds shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  reserveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
  },
});

export default ShowTimeDetailsScreen;