import { Stack } from 'expo-router';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useRouter } from 'expo-router';
import { movies } from '~/lib/mocks';


export default function Landing() {


  const router = useRouter();
  const goToLogin = () => {

    router.push('/login');
  } 

  const goToRegister = () => {
    
    router.push('/register');
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.header}>
            <Text style={styles.logo}>CINE</Text>
            <TouchableOpacity style={styles.signInButton} onPress={goToLogin}>
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.hero}>
            <Text style={styles.heroTitle}>
              Experience Movies{'\n'}Like Never Before
            </Text>
            <View style={styles.heroImageContainer}>
              <Image
                source={{ uri: 'https://i.pinimg.com/474x/fb/87/dc/fb87dc596ec2932c348987e06cd0dfc6.jpg' }}
                style={styles.heroImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(15,23,42,0.8)']}
                style={styles.imageOverlay}
              />
            </View>
            <TouchableOpacity style={styles.ctaButton} onPress={goToRegister}>
              <MaterialCommunityIcons name="ticket-confirmation" size={24} color="white" />
              <Text style={styles.ctaText}>Book Tickets Now</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Trending Now</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieScroll}>

            {movies.map((item) => (
              <View key={item.id} style={styles.movieCard}>
                <Image
                  source={{ uri: `${item.imageUrl}` }}
                  style={styles.moviePoster}
                />
                <View style={styles.posterOverlay}>
                  <Text style={styles.movieTitle}>Movie Title {item.title}</Text>
                  <View style={styles.ratingBadge}>
                    <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                    <Text style={styles.ratingText}>{item.rate}</Text>
                  </View>
                </View>
              </View>

            ))}
          </ScrollView>

        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(225,29,72,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  signInButton: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  signInText: {
    color: '#fff',
    fontWeight: '500',
  },
  hero: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 42,
    marginBottom: 24,
  },
  heroImageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  ctaButton: {
    backgroundColor: '#E11D48',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 15,
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 24,
    marginVertical: 20,
  },
  movieScroll: {
    paddingLeft: 24,
  },
  movieCard: {
    width: 160,
    marginRight: 16,
    borderRadius: 15,
    overflow: 'hidden',
    transform: [{ rotate: '-3deg' }],
  },
  moviePoster: {
    width: '100%',
    height: 240,
  },
  posterOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(15,23,42,0.8)',
  },
  movieTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251,191,36,0.2)',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: '#FBBF24',
    fontSize: 12,
    marginLeft: 4,
  },


});