import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Animated, Easing } from 'react-native';
import axiosInstance from '~/lib/apiClient';
import { replaceIp } from '~/lib/helper';
import { LinearGradient } from 'expo-linear-gradient';

interface ShowTime {
  _id: string;
  movie: {
    title: string;
    image: string;
    duration: number;
  };
  time: Date;
  room: {
    name: string;
    type: string;
    seats: { row: number; seatNumber: number; isAvailable: boolean }[];
  };
  price: number;
}

interface Seat {
  row: number;
  seatNumber: number;
  isAvailable: boolean;
}

const ShowTimeDetailsScreen = () => {
  const { showTimeId } = useLocalSearchParams<{ showTimeId: string }>();
  const [showTime, setShowTime] = useState<ShowTime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReservationModalVisible, setReservationModalVisible] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const fadeAnim = useState(new Animated.Value(0))[0];

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
    setReservationModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handleSeatSelection = (seat: Seat) => {
    if (!seat.isAvailable) return;

    const isAlreadySelected = selectedSeats.some(
      (s) => s.row === seat.row && s.seatNumber === seat.seatNumber
    );

    if (isAlreadySelected) {
      setSelectedSeats((prev) =>
        prev.filter((s) => !(s.row === seat.row && s.seatNumber === seat.seatNumber))
      );
    } else {
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const confirmReservation = () => {    
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }

    console.log('Selected Seats:', selectedSeats);
    alert(`Reservation confirmed for ${selectedSeats.length} seat(s)!`);
    setReservationModalVisible(false);
    setSelectedSeats([]);
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
    <LinearGradient colors={['#0f0f0f', '#1a1a1a']} style={styles.container}>
     

          <Text style={styles.modalTitle}>Select Your Seats</Text>

          <ScrollView contentContainerStyle={styles.seatGrid}>
            {showTime.room.seats.map((seat) => (

              <TouchableOpacity
                key={`${seat.row}-${seat.seatNumber}`}
                onPress={() => handleSeatSelection(seat)}
                disabled={!seat.isAvailable}
              >
                <Image source={
                    !seat.isAvailable
                      ? require('~/assets/seat.png')
                      : selectedSeats.some(
                          (s) => s.row === seat.row && s.seatNumber === seat.seatNumber
                        )
                      ? require('~/assets/seat.jpg')
                      : require('~/assets/icon.png')
                  }
                  style={styles.seatImage}
                />
              </TouchableOpacity>

            ))}
          </ScrollView>
          <Text style={styles.selectedSeatsText}>
            Selected Seats: {selectedSeats.map((s) => `${s.row}-${s.seatNumber}`).join(', ')}
          </Text>
          <TouchableOpacity style={styles.confirmButton} onPress={confirmReservation}>
            <LinearGradient colors={['#b21f1f', '#ff6b6b']} style={styles.confirmButtonGradient}>
              <Text style={styles.confirmButtonText}>Confirm Reservation</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setReservationModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderRadius: 10,
    overflow: 'hidden',
  },
  reserveButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  screenVisualization: {
    width: '100%',
    height: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
  },
  screenText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  seatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  seatImage: {
    width: 40,
    height: 40,
    margin: 5,
  },
  selectedSeatsText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },
  confirmButton: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ShowTimeDetailsScreen;