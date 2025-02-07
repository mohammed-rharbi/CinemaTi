import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Movie } from '~/lib/types';
import axiosInstance from '~/lib/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { replaceIp } from '~/lib/helper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface User{

    _id: string;
    name: string;
    email: string
}

const ProfileScreen = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [user , setUser]= useState<User | null>(null)
  const [loading, setLoading] = useState(false);


  const router = useRouter();

  useEffect(() => {

    console.log(user);
    
    const getFavoriteMovies = async () => {
      setLoading(true);
      
      const userId = await AsyncStorage.getItem('userId');
  
      try {

        const res = await axiosInstance.get(`/favorite/myFavorites/${userId}`);

        const userData = await axiosInstance.get(`/auth/getUserById/${userId}`);
        setUser(userData.data.updatUser);

        
        if (res.data.favorites) {
          const allMovies = res.data.favorites.flatMap(fav => fav.movies);
          setFavorites(allMovies);
        } 


          

      } catch (error: any) {
        console.log(error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
  
    getFavoriteMovies();
  }, []);

  const handleEditProfile = () => {
    console.log('Edit profile pressed');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>no user found...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: "https://i.pinimg.com/736x/51/ab/15/51ab152471bdc71a12aac861ae8ceb58.jpg" }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Favorite Movies</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieScroll}>
        {favorites.length === 0 ? (
          <Text style={styles.noFavoritesText}>No favorite movies yet.</Text>
        ) : (
          favorites.map((movie) => (
            <TouchableOpacity key={movie._id} style={styles.movieCard} onPress={()=> router.push(`/moviePage?movieId=${movie._id}`)}>
              <Image
                source={{uri : replaceIp(movie.image , process.env.IP as string)}}
                style={styles.movieImage}
              />
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.movieGenre}>{movie.gen}</Text>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>8.2/10</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingBottom: 80,
  },
  profileHeader: {
    padding: 20,
    backgroundColor: '#2d2d2d',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },

  movieScroll: {
    paddingLeft: 20,
  },
  movieCard: {
    width: 160,
    marginRight: 15,
  },
  movieImage: {
    width: '100%',
    height: 240,
    borderRadius: 15,
  },
  movieTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  movieGenre: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    color: '#FFD700',
    marginLeft: 5,
    fontSize: 12,
  },
  noFavoritesText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    fontSize: 18,
    color: '#BBBBBB',
  },
});

export default ProfileScreen;
