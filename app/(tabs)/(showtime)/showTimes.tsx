import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator,} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axiosInstance from "~/lib/apiClient";
import { replaceIp } from "~/lib/helper";
import { ShowTime } from "~/lib/types";


const ShowTimesScreen = () => {
  const [showTimes, setShowTimes] = useState<ShowTime[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  
  useEffect(() => {
    const getShowTimes = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/showTime/allShowtimes");
        setShowTimes(res.data.showTimes);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getShowTimes();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>Loading show times...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#0f0f0f", "#1a1a1a"]}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text style={styles.header}>Today's Show Times</Text>
      <FlatList
        data={showTimes}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.movieContainer}
            onPress={() => router.push(`/showTimePage?showTimeId=${item._id}`)}
          >
            <Image
              source={{
                uri: replaceIp(item.movie.image, process.env.IP as string),
              }}
              style={styles.poster}
            />
            <View style={styles.movieInfo}>
              <Text style={styles.movieTitle}>{item.movie.title}</Text>
              <Text style={styles.movieDetails}>
                {new Date(item.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{" "}
                | {item.room.name} ({item.room.type})
              </Text>
              <Text style={styles.movieDetails}>
                Duration: {item.movie.duration} mins
              </Text>
              <Text style={styles.movieDetails}>
                Price: ${item.price.toFixed(2)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f0f",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#fff",
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  movieContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#1f1f1f",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 5,
  },
  movieInfo: {
    flex: 1,  
    marginLeft: 15,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  movieDetails: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 3,
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
});

export default ShowTimesScreen;
