import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axiosInstance from "~/lib/apiClient";
import { useLocalSearchParams } from "expo-router";
import { replaceIp } from "~/lib/helper";
import { Movie } from "~/lib/types";

const { width } = Dimensions.get("window");

const MovieDetailsScreen = () => {

    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { movieId } = useLocalSearchParams();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const res = await axiosInstance.get(`/movie/getMovie/${movieId}`);
                setMovie(res.data.movie);
            } catch (err: any) {
                setError(err.message || "Failed to fetch movie details.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
    }, [movieId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    if (!movie) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No movie data found.</Text>
            </View>
        );
    }

    if (!movieId) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No movie data found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: replaceIp(movie.image, process.env.IP as string) }} style={styles.image} />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gradient} />
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{movie.title}</Text>
                    <Text style={styles.subtitle}>{`${new Date(movie.relseDate).toLocaleDateString()} • ${movie.duration} • ${movie.gen}`}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={24} color="#FFD700" />
                    <Text style={styles.rating}>8.8</Text>
                </View>

                <TouchableOpacity style={styles.watchButton}>
                    <Ionicons name="play" size={24} color="white" />
                    <Text style={styles.watchButtonText}>Watch Now</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Overview</Text>
                <Text style={styles.description}>{movie.description}</Text>

                <Text style={styles.sectionTitle}>Director</Text>
                <Text style={styles.info}>{movie.deroctor}</Text>

                <Text style={styles.sectionTitle}>Cast</Text>
                <Text style={styles.info}>Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
    },
    imageContainer: {
        height: width * 1.5,
        width: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    gradient: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "50%",
    },
    titleContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#BBBBBB",
    },
    content: {
        padding: 20,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    rating: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginLeft: 8,
    },
    watchButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E50914",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginBottom: 24,
    },
    watchButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
        marginTop: 16,
    },
    description: {
        fontSize: 16,
        color: "#BBBBBB",
        lineHeight: 24,
    },
    info: {
        fontSize: 16,
        color: "#BBBBBB",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
    },
    loadingText: {
        fontSize: 18,
        color: "#BBBBBB",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
    },
    errorText: {
        fontSize: 18,
        color: "#E50914",
    },
});

export default MovieDetailsScreen;