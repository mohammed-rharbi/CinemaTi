import { Stack } from 'expo-router';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect , useState } from 'react';
import axiosInstance from '~/lib/apiClient';
import { replaceIp } from '~/lib/helper';
import { useRouter } from 'expo-router';


interface Movie {
  _id: string;
  title: string;
  image: any;
  gen: string;
  duration: number;
}

export default function Home() {

  const [movies, setMovies] = useState<Movie[]>([])

  const router = useRouter()


  
  useEffect(()=>{

    const fetchData = async () => {

  try{

    const response = await axiosInstance.get('/movie/getLatestMovies');
    setMovies(response.data.latestMovies);

  }catch(error){
    console.log(error);
  }
      
    }

    fetchData();

  },[])


  return (
    <>
      <Stack.Screen options={{ 
        title: 'Cinema App',
        headerTitleStyle: { color: '#fff' },
        headerStyle: { backgroundColor: '#1A1A1A' },
        headerRight: () => (
          <TouchableOpacity style={{ marginRight: 15 }}>
            <MaterialCommunityIcons name="account" size={28} color="#fff" />
          </TouchableOpacity>
        )
      }} />
      
      <ScrollView style={styles.container}>
`
`        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" />
          <Text style={styles.searchText}>Search movies, cinemas...</Text>
        </View>


      <View>
        <Text style={styles.sectionTitle}>Now Showing</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieScroll}>
          {movies.map((movie) => (
            <TouchableOpacity key={movie._id} style={styles.movieCard} onPress={()=> router.push(`/moviePage?movieId=${movie._id}`)}>
              <Image
                source={{uri : replaceIp(movie.image , process.env.IP as string)}}
                style={styles.movieImage}
              />
              <Text style={styles.movieTitle}>{movie.title}</Text>
              <Text style={styles.movieGenre}>{movie.gen} • 🕒{movie.duration} m</Text>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>8.2/10</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        </View> 


      <View>
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        {[1, 2].map((item) => (
          <TouchableOpacity key={item} style={styles.comingSoonCard}>
            <Image
              source={{ uri: `https://i.pinimg.com/474x/7f/fe/c8/7ffec8272ccaf6ca6191de91c1af5daf.jpg` }}
              style={styles.comingSoonImage}
            />
            <View style={styles.comingSoonDetails}>
              <Text style={styles.comingSoonTitle}>Upcoming Movie {item}</Text>
              <Text style={styles.comingSoonGenre}>Drama • Romance</Text>
              <View style={styles.dateContainer}>
                <MaterialCommunityIcons name="calendar" size={16} color="#666" />
                <Text style={styles.dateText}>March {15 + item}, 2024</Text>
              </View>
              <TouchableOpacity style={styles.remindButton}>
                <Text style={styles.remindText}>Remind Me</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>


        <View>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryContainer}>
          {['Action', 'Comedy', 'Horror', 'Drama'].map((genre) => (
            <TouchableOpacity key={genre} style={styles.categoryCard}>
              <MaterialCommunityIcons 
                name={genre === 'Action' ? 'movie-open' : 'popcorn'} 
                size={32} 
                color="#fff" 
              />
              <Text style={styles.categoryText}>{genre}</Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>

      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={()=> router.push('/showTimes')}>
        <MaterialCommunityIcons name="ticket" size={28} color="#fff" />
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    margin: 20,
  },
  searchText: {
    color: '#666',
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 15,
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
  comingSoonCard: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 10,
  },
  comingSoonImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  comingSoonDetails: {
    flex: 1,
    marginLeft: 15,
  },
  comingSoonTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  comingSoonGenre: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateText: {
    color: '#666',
    marginLeft: 5,
    fontSize: 12,
  },
  remindButton: {
    backgroundColor: '#E50914',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  remindText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: '48%',
    height: 100,
    backgroundColor: '#333',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  categoryText: {
    color: '#fff',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#E50914',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});