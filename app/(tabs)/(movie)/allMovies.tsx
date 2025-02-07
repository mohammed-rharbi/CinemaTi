import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView , TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import axiosInstance from '~/lib/apiClient';
import { replaceIp } from '~/lib/helper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Movie } from '~/lib/types';

const MovieList = () => {
    const router = useRouter()
    const [movies, setMovies] = useState<Movie[]>([]);
    const scaleValue = new Animated.Value(1);

    useEffect(() => {
        const getMovies = async ()=>{
            try{
                const res =  await axiosInstance.get('/movie/allMovies');
                setMovies(res.data.movies);
            }catch(error: any){
                console.log(error);   
            }
        }
        getMovies()
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Now Showing</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.movieScroll}
            >
                {movies.map((movie) => (
                    <Animated.View 
                        key={movie._id} 
                        style={{ transform: [{ scale: scaleValue }] }}
                    >
                        <TouchableOpacity 
                            style={styles.movieCard}
                            onPress={() => router.push(`/moviePage?movieId=${movie._id}`)}
                            activeOpacity={0.9}
                        >
                            <Image
                                source={{uri : replaceIp(movie.image , process.env.IP as string)}}
                                style={styles.movieImage}
                            />
                            <View style={styles.movieInfo}>
                                <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
                                <Text style={styles.movieGenre}>{movie.gen}</Text>
                                <View style={styles.movieMeta}>
                                    <MaterialCommunityIcons name="clock-time-three" size={14} color="#FFD700" />
                                    <Text style={styles.metaText}>{movie.duration} mins</Text>
                                    <MaterialCommunityIcons name="star" size={14} color="#FFD700" style={styles.ratingIcon} />
                                    <Text style={styles.metaText}>8.2</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1F',
    paddingVertical: 24,
    paddingBottom:80,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  seeAll: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  movieScroll: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  movieCard: {
    width: 180,
    marginRight: 15,
    backgroundColor: '#1A1A2F',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  movieImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  movieGenre: {
    color: '#8D8D9E',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 4,
    marginRight: 12,
  },
  ratingIcon: {
    marginLeft: 'auto',
  },
});

export default MovieList;