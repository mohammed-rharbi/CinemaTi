import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axiosInstance from "~/lib/apiClient";
import { useLocalSearchParams } from "expo-router";
import { replaceIp } from "~/lib/helper";
import { Movie } from "~/lib/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Comment {
  _id: string;
  content: string;
  user: {
    name: string;
  };
  createdAt: string;
}

const MovieDetailsScreen = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const { movieId } = useLocalSearchParams();
  const [userId , setUserId] = useState('')


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!movieId) {
          setError("Invalid movie ID");
          return;
        }

        const movieRes = await axiosInstance.get(`/movie/getMovie/${movieId}`);
        setMovie(movieRes.data.movie);
        setLikeCount(movieRes.data.movie.likes || 0);


        const commentsRes = await axiosInstance.get(`/comments/getComments/${movieId}`);
        setComments(commentsRes.data.comments);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const handleLike = async () => {

    const Uid = await AsyncStorage.getItem('userId');
    if (!Uid) {
      console.error("User ID not found");
      return;
    }    


    try {
      await axiosInstance.patch(`/favorite/addToFavorite`, {movieId:movieId , userId:Uid});
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
  
    const Uid = await AsyncStorage.getItem('userId');
    if (!Uid) {
      console.error("User ID not found");
      return;
    }
  
    const body = {
      content: newComment,
      movieId: movieId,
      userId: Uid
    };
  
    try {
      const res = await axiosInstance.post('/comments/addComment', body);
      setComments([...comments, res.data.comment]);
      setNewComment('');
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

  if (loading) return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error}</Text>
    </View>
  );

  if (!movie) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>No movie data found.</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: replaceIp(movie.image, process.env.IP as string) }} 
          style={styles.image} 
        />
        <LinearGradient 
          colors={["transparent", "rgba(0,0,0,0.8)"]} 
          style={styles.gradient} 
        />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.subtitle}>
            {`${new Date(movie.relseDate).toLocaleDateString()} • ${movie.duration} • ${movie.gen}`}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.interactionContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={24} color="#FFD700" />
            <Text style={styles.rating}>8.8</Text>
          </View>
          
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={24} 
              color={isLiked ? "#E50914" : "white"} 
            />
            <Text style={styles.likeCount}>{likeCount}</Text>
          </TouchableOpacity>
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

        <Text style={styles.sectionTitle}>Comments ({comments.length})</Text>
        {comments.map(comment => (
          <View key={comment._id} style={styles.commentContainer}>
            <Text style={styles.commentAuthor}>{comment.user.name}</Text>
            <Text style={styles.commentText}>{comment.content}</Text>
            <Text style={styles.commentDate}>
              {new Date(comment.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}

        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#888"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity 
            style={styles.commentButton} 
            onPress={handleComment}
            disabled={!newComment.trim()}
          >
            <Text style={styles.commentButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  imageContainer: {
    height: width * 0.6,
    width: "100%",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    top: undefined,
    height: "60%",
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
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 8,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 8,
  },
  likeCount: {
    color: "white",
    fontSize: 16,
  },
  watchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E50914",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  watchButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginVertical: 16,
  },
  description: {
    fontSize: 16,
    color: "#BBBBBB",
    lineHeight: 24,
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
    color: "#BBBBBB",
    marginBottom: 16,
  },
  commentContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  commentAuthor: {
    color: "#E50914",
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    color: "white",
    fontSize: 14,
    marginBottom: 4,
  },
  commentDate: {
    color: "#888",
    fontSize: 12,
  },
  commentInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    color: "white",
    borderRadius: 8,
    padding: 12,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  commentButton: {
    backgroundColor: "#E50914",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  commentButtonText: {
    color: "white",
    fontWeight: "bold",
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