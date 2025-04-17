import React, { useState, useRef, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import axiosInstance from '~/lib/apiClient';
import { useLocalSearchParams } from 'expo-router';
import { Movie } from '~/lib/types';

const MoviePlayerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [movieData, setMovieData] = useState<Movie | null>(null);
  const { movieId } = useLocalSearchParams()

  const videoSource = {
    uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  };
  
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axiosInstance.get(`/movie/getMovie/${movieId}`);
        setMovieData(response.data.movie);
        setIsError(false);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (isError || !movieData) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Failed to load movie data</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>


        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={{ uri: videoSource.uri }}
            useNativeControls={false}
            resizeMode="contain"
            isLooping
            onPlaybackStatusUpdate={setStatus}
          />


          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() =>
                status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
              }
            >
              <Ionicons
                name={status.isPlaying ? "pause" : "play"}
                size={40}
                color="white"
              />
            </TouchableOpacity>

            <Slider
              style={styles.progressBar}
              value={status.positionMillis || 0}
              minimumValue={0}
              maximumValue={status.durationMillis || 1}
              minimumTrackTintColor="#E50914"
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor="#E50914"
              onSlidingComplete={async value => {
                await video.current.setPositionAsync(value);
              }}
            />
          </View>
        </View>


        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{movieData.title}</Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.genre}>{movieData.gen} . {movieData.duration}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{8.9}</Text>
            </View>
          </View>

          <Text style={styles.description}>{movieData.description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  videoContainer: {
    height: 300,
    backgroundColor: 'black',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#E50914',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  video: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  progressBar: {
    flex: 1,
    marginLeft: 20,
    height: 40,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  genre: {
    color: '#E50914',
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: 'white',
    marginLeft: 4,
    fontSize: 16,
  },
  description: {
    color: '#AAAAAA',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default MoviePlayerScreen;