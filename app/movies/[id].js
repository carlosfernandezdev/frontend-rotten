import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useWindowDimensions } from 'react-native';

import { getMovieDetails } from "../../api/movies";
import { Score } from "../../Components/Score";
import { fetchsito1 } from '../../utils/fetchMethod';
import AddReview from "../../Components/addReview";
import ModalEditReview from "../../Components/Modal";

const MovieDetails = () => {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [showFullCast, setShowFullCast] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [scoreCount, setScoreCount] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const router = useRouter();

  async function fetchMovieDetails() {
    try {
      const movieDetails = await getMovieDetails(id);
      setMovie(movieDetails);
    } catch (error) {
      //console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  }

  const getReviews = async () => {
    try {
      setLoadingComments(true);
      const response = await fetchsito1.get(`/comentary/getComentaries/${id}`);
      const data = await response.json();

      if (response.ok) {
        const { user, comentaries } = data;

        setTimeout(() => {
          const { reviews, newTotal, newScoreCount } = comentaries.reduce(
            (acc, review, index) => {
              const isActionable = user.id === review.id_user._id;

              acc.newTotal += review.rating;
              acc.newScoreCount = index + 1;
              acc.reviews.push({
                id: review._id,
                author: review.id_user.username,
                date: review.createdAt,
                quote: review.comentario,
                rating: review.rating,
                isActionable,
              });
              return acc;
            },
            { reviews: [], newTotal: 0, newScoreCount: 0 }
          );

          setTotalScore(newTotal);
          setScoreCount(newScoreCount);
          setMovie((prevMovies) => ({
            ...prevMovies,
            reviews,
          }));
          setLoadingComments(false);
        }, 500);
      } else {
        setLoadingComments(false);
      }
    } catch (error) {
      setLoadingComments(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getReviews();
      fetchMovieDetails();
    }, [id, reload])
  );

  const handleAddReviewAndScore = async (reviewText, reviewRating) => {
    try {
      const newReview = {
        date: new Date().toISOString(),
        quote: reviewText,
        rating: parseInt(reviewRating),
      };

      const film = {
        imagen: movie.img,
        titulo: movie.title,
        descripcion: movie.description,
        rating: movie.score,
        generos: movie.genres,
        estreno: movie.releaseDate,
        id: movie.movieId,
      };

      const response = await fetchsito1.post("/comentary/postComentary", {
        newReview,
        film,
        type: "Movie",
      });

      const data = await response.json();
      if (response.ok) {
        setLoadingComments(true);
        setReload((prev) => !prev);
      } else {
        //console.error(data);
      }
    } catch (error) {
      //console.error("Error fetching movie details:", error);
    }
  };

  const handleDeleteReview = async (review) => {
    try {
      const response = await fetchsito1.delete(
        `/comentary/deleteComentary/${review.id}`
      );
      const data = await response.json();
      if (response.ok) {
        setReload((prev) => !prev);
      }
    } catch (error) {
      //console.error("Error al borrar el comentario:", error);
    }
  };

  const handleEditReview = (review) => {
    setSelectedReview(review);
    setTimeout(() => {
      setModalVisible(true);
    }, 500);
  };

  const handleSaveEditedReview = async (editedReview, editedScore) => {
    try {
      const response = await fetchsito1.patch(
        `/comentary/updateComentary/${selectedReview.id}`,
        { quote: editedReview, rating: editedScore }
      );
      const data = await response.json();
      if (response.ok) {
        //console.log("comentario actualizado");
      }
    } catch (error) {
      console.error("Error al actualizar el comentario:", error);
    } finally {
      setModalVisible(false);
      setReload((prev) => !prev);
    }
  };

  const averageScore =
    scoreCount > 0 ? Number((totalScore / scoreCount).toFixed(1)) : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Cargando detalle...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header con botón volver */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={22} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Detalle de película
        </Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal con poster y descripción */}
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: movie.img }}
              style={styles.image}
              resizeMode="cover"
              onError={(error) =>
                console.log("Error loading image:", error)
              }
            />
          </View>

          <View style={styles.scoresRow}>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreLabel}>Puntaje original</Text>
              <Score score={movie.score} maxScore={10} />
            </View>
            <View style={styles.scoreBlock}>
              <Text style={styles.scoreLabel}>Puntaje usuarios</Text>
              <Score score={averageScore} maxScore={10} />
            </View>
          </View>

          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.description}>{movie.description}</Text>
        </View>

        {/* Fecha de estreno */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha de estreno</Text>
          <Text style={styles.sectionBody}>
            {movie.releaseDate
              ? new Date(movie.releaseDate).toLocaleDateString()
              : "No hay información disponible."}
          </Text>
        </View>

        {/* Géneros */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Géneros</Text>
          <Text style={styles.sectionBody}>
            {movie.genres && movie.genres.length > 0
              ? movie.genres.join(", ")
              : "No hay información disponible del género."}
          </Text>
        </View>

        {/* Elenco */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elenco</Text>
          {movie.cast && movie.cast.length > 0 ? (
            <>
              {showFullCast ? (
                movie.cast.map((actor, index) => (
                  <View key={index} style={styles.castItem}>
                    <Text style={styles.castName}>{actor.name}</Text>
                    <Text style={styles.castCharacter}>
                      como {actor.character}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.castItem}>
                  <Text style={styles.castName}>{movie.cast[0].name}</Text>
                  <Text style={styles.castCharacter}>
                    como {movie.cast[0].character}
                  </Text>
                </View>
              )}
              <View style={styles.castButtonWrapper}>
                <Button
                  title={showFullCast ? "Ocultar elenco" : "Mostrar elenco"}
                  onPress={() => setShowFullCast((prev) => !prev)}
                />
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>
              No hay información disponible del elenco.
            </Text>
          )}
        </View>

        {/* Reseñas */}
        <View style={styles.section}>
          <View style={styles.reviewsHeaderRow}>
            <Text style={styles.sectionTitle}>Reseñas de usuarios</Text>
            {loadingComments && (
              <ActivityIndicator size="small" color="#4F46E5" />
            )}
          </View>

          {!loadingComments && (
            <>
              {movie.reviews && movie.reviews.length > 0 ? (
                movie.reviews.map((review, index) => (
                  <View key={index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewAuthor}>
                        {review.author}
                      </Text>
                      {review.isActionable && (
                        <View style={styles.reviewActions}>
                          <Pressable
                            onPress={() => handleEditReview(review)}
                            style={styles.iconAction}
                          >
                            <MaterialIcons
                              name="edit"
                              size={20}
                              color="#4B5563"
                            />
                          </Pressable>
                          <Pressable
                            onPress={() => handleDeleteReview(review)}
                            style={styles.iconAction}
                          >
                            <MaterialIcons
                              name="delete"
                              size={20}
                              color="#DC2626"
                            />
                          </Pressable>
                        </View>
                      )}
                    </View>
                    <Text style={styles.reviewDate}>
                      {new Date(review.date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.reviewQuote}>{review.quote}</Text>
                    <View style={styles.reviewRatingContainer}>
                      <Text style={styles.reviewRatingLabel}>Rating:</Text>
                      <Text style={styles.reviewRating}>
                        {review.rating}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noDataText}>
                  No hay información disponible de las reseñas.
                </Text>
              )}
            </>
          )}
        </View>

        {/* Formulario para agregar reseña */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Añadir reseña</Text>
          <AddReview onSubmitReviewAndScore={handleAddReviewAndScore} />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <ModalEditReview
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEditedReview}
        review={selectedReview || { quote: "", rating: "" }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4F4F5",
  },

  // Loader
  loadingWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#4B5563",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 6,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // Card principal
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 300,
    borderRadius: 12,
  },
  scoresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginBottom: 12,
    gap: 12,
  },
  scoreBlock: {
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "justify",
  },

  // Secciones
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: "#4B5563",
  },

  // Elenco
  castItem: {
    marginBottom: 8,
  },
  castName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  castCharacter: {
    fontSize: 13,
    color: "#6B7280",
  },
  castButtonWrapper: {
    marginTop: 8,
  },

  // Reseñas
  reviewsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewItem: {
    marginBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  reviewActions: {
    flexDirection: "row",
  },
  iconAction: {
    marginLeft: 8,
  },
  reviewDate: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 2,
    marginBottom: 4,
  },
  reviewQuote: {
    fontSize: 13,
    color: "#4B5563",
  },
  reviewRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  reviewRatingLabel: {
    fontSize: 13,
    color: "#374151",
    marginRight: 4,
  },
  reviewRating: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },

  noDataText: {
    color: "#9CA3AF",
    fontStyle: "italic",
    fontSize: 13,
  },
});

export default MovieDetails;
