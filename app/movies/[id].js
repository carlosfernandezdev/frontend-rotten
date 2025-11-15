import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from "expo-router";
import { Pressable, View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Image, ScrollView, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import Logo from "../../Components/Logo";
import { getMovieDetails } from "../../api/movies";
import { Score } from "../../Components/Score";
import { fetchsito1 } from '../../utils/fetchMethod';
import AddReview from "../../Components/addReview";
import { useFocusEffect } from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import ModalEditReview from "../../Components/Modal";


const MovieDetails = () => {
    ////console.log('detalle de pelicula')
    const { width } = useWindowDimensions();
    //////console.log(width)
    const { id } = useLocalSearchParams();
    ////console.log('id de la pelicula', id)
    const [movie, setMovie] = useState({});
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [showFullCast, setShowFullCast] = useState(false);
    const [showFullReviews, setShowFullReviews] = useState(false);
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
        ////console.log(movie)
        } catch (error) {
        //console.error("Error fetching movie details:", error);
        } finally {
        setLoading(false);
        //setLoadingComments(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getReviews();
            fetchMovieDetails();
        }, [id, reload])
    );

    const getReviews = async () => {
        try {
            setLoadingComments(true)
            const response = await fetchsito1.get(`/comentary/getComentaries/${id}`);
            const data = await response.json();

            ////console.log(response.ok)
            if (response.ok) {
                const { user, comentaries } = data;
                ////console.log('----------------------------')
                //console.log(user)
                ////console.log('----------------------------')
                ////console.log('loadingComments es',loadingComments)
                setTimeout(() => {
                    
                    ////console.log(comentaries.length)
    
                    const { reviews, newTotal, newScoreCount } = comentaries.reduce((acc, review, index) => {
                        // //console.log(review)
                        // //console.log(`userId: ${user.id} - review.id_user._id: ${review.id_user._id}`)
                        let isActionable = user.id === review.id_user._id;

                        ////console.log(isActionable)
                        // //console.log(review)
                        //console.log('el usuario actual puede editar o borrar este comentario?', isActionable);
                        acc.newTotal += review.rating;
                        acc.newScoreCount = index + 1;
                        acc.reviews.push({
                            id: review._id,
                            author: review.id_user.username,
                            date: review.createdAt,
                            quote: review.comentario,
                            rating: review.rating,
                            isActionable
                        });
                        return acc;
                    }, { reviews: [], newTotal: 0, newScoreCount: 0 });
    
        
                    setTotalScore(newTotal);
                    setScoreCount(newScoreCount);
                    setMovie((prevMovies) => ({
                        ...prevMovies,
                        reviews,
                    }));
                    setLoadingComments(false)
                }, 500)
            } else {
                ////console.log('a')
                setLoadingComments(false)
                //console.error('Error al cargar los comentarios:', data.message);
            }
        } catch (error) {
            ////console.log('b')
            //console.error('Error al cargar los comentarios:', error);
        }
    };

  // Función para actualizar las calificaciones y el promedio
  const handleAddReviewAndScore = async (reviewText, reviewRating) => {
    try {
        ////console.log('Review', reviewText)
        ////console.log('Rating', reviewRating)

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
            id: movie.movieId
        };

        ////console.log('serie',movie)
        ////console.log('film',film)

        const response = await fetchsito1.post("/comentary/postComentary", { newReview, film, type: 'Movie' });
        const contentType = response.headers.get("content-type");
        ////console.log(contentType);

        const data = await response.json();
        if (response.ok) {
            setLoadingComments(true)
            ////console.log(data);
            setReload(!reload);
        } else {
            //console.error(data);
        }
    } catch (error) {
        //console.error("Error fetching movie details:", error);
    }
  };

  const handleDeleteReview = async (review) => {
    try {
        ////console.log(review)
        ////console.log('comentario a borrar', review.id)
        const response = await fetchsito1.delete(`/comentary/deleteComentary/${review.id}`);
        ////console.log('a')
        const data = await response.json();
        ////console.log('b')
        ////console.log('response del delete comentario', response.ok)
        if(response.ok){
            ////console.log('c')
            setReload(!reload);
        }
    } catch (error) {
        //console.error('Error al borrar el comentario:', error);
    }
};

const handleEditReview = (review) => {
    setSelectedReview(review);
    setTimeout(() => {
        setModalVisible(true);
    }, 500)
    
};

const handleSaveEditedReview = async (editedReview, editedScore) => {
    // Call your API to save the edited review and rating
    // After saving, update the review list with the new data
    // You can make an API call here to update the review and reload the list

    try {
        //console.log('editedReview', editedReview)
        //console.log('editedScore', editedScore)
        //console.log('selectedReview', selectedReview)
        const response = await fetchsito1.patch(`/comentary/updateComentary/${selectedReview.id}`, { quote: editedReview, rating: editedScore });
        //console.log(response)
        const data = await response.json();
        //console.log(data)
        if(response.ok){
            //console.log('comentario actualizado')
        }
    } catch (error) {
        console.error('Error al actualizar el comentario:', error);
    }finally{
        setModalVisible(false);
        setReload(!reload); // Trigger a reload to reflect changes
    }
};
    // Calcular el promedio
    const averageScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;



  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Logo />
            <Pressable onPress={() => router.back()} style={styles.backButton}>
                <AntDesign name="back" size={24} color="white" />
            </Pressable>

            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image 
                            source={{ uri: movie.img }} 
                            style={styles.image}
                            resizeMode="cover"
                            onError={(error) => console.log("Error loading image:", error)}
                        />
                    </View>
                    {/* Mostrar el promedio de calificaciones */}
                    <View style={styles.scoresection}>
                        <Score score={movie.score} maxScore={10} />
                        <Score score={averageScore} maxScore={10} />
                    </View>

                    <Text style={styles.title}>{movie.title}</Text>
                    <Text style={styles.description}>{movie.description}</Text>

                    {/* Fecha de estreno */}
                    <View style={[styles.section, styles.SectionColor]}>
                        <Text style={styles.sectionTitle}>Fecha de estreno</Text>
                        <Text style={styles.releaseDate}>{new Date(movie.releaseDate).toLocaleDateString()}</Text>
                    </View>

                    {/* Géneros */}
                    <View style={[styles.section, styles.SectionColor]}>
                        <Text style={styles.sectionTitle}>Generos</Text>
                        <Text style={styles.genres}>
                            {movie.genres && movie.genres.length > 0 ? movie.genres.join(", ") : "No hay informacion disponible del genero."}
                        </Text>
                    </View>

                    {/* Elenco */}
                    <View style={[styles.section, styles.SectionColor]}>
                        <Text style={styles.sectionTitle}>Elenco</Text>
                        {movie.cast && movie.cast.length > 0 ? (
                            <>
                                {showFullCast ? (
                                    movie.cast.map((actor, index) => (
                                        <View key={index} style={styles.castItem}>
                                            <Text style={styles.castName}>{actor.name}</Text>
                                            <Text style={styles.castCharacter}>as {actor.character}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <View style={styles.castItem}>
                                        <Text style={styles.castName}>{movie.cast[0].name}</Text>
                                        <Text style={styles.castCharacter}>as {movie.cast[0].character}</Text>
                                    </View>
                                )}
                                <Button 
                                    title={showFullCast ? "Ocultar elenco" : "Mostrar elenco"} 
                                    onPress={() => setShowFullCast(!showFullCast)} 
                                />
                            </>
                        ) : (
                            <Text style={styles.noDataText}>No hay Información disponible del elenco.</Text>
                        )}
                    </View>

                    {/* Críticas */}
                    <View style={[styles.section, styles.SectionColor]}>
                        <Text style={styles.sectionTitle}>
                            Reseñas de usuarios
                        </Text>
                        {loadingComments && <ActivityIndicator size="small" color="#fff" style={styles.loadingIndicator} />}
                        {!loadingComments && (
                            <>
                                {movie.reviews && movie.reviews.length > 0 ? (
                                    movie.reviews.map((review, index) => (

                                        <View key={index} style={styles.reviewItem}>
                                            <View style={styles.reviewHeader}>
                                                <Text style={styles.reviewAuthor}>{review.author}</Text>
                                                {review.isActionable && (
                                                    <>
                                                    <View style={styles.reviewActions}>
                                                    <Pressable onPress={() => handleEditReview(review)}>
                                                        <MaterialIcons name="edit" size={24} color="white" />
                                                    </Pressable>
                                                    <Pressable onPress={() => handleDeleteReview(review)}>
                                                        <MaterialIcons name="delete" size={24} color="white" />
                                                    </Pressable>
                                                   </View>
                                                    </>
                                                )}
                                            </View>
                                            <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
                                            <Text style={styles.reviewQuote}>{review.quote}</Text>
                                            {/* <RenderHtml
                                                    contentWidth={width}
                                                    source={{ html: review.quote }}
                                                    baseStyle={styles.reviewQuote}
                                                /> */}
                                            <View style={styles.reviewRatingContainer}>
                                                <Text style={styles.reviewRatingLabel}>Rating:</Text>
                                                <Text style={styles.reviewRating}>{review.rating}</Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.noDataText}>No hay información disponible de las reseñas.</Text>
                                )}
                            </>
                        )}
                    </View>
                    <AddReview onSubmitReviewAndScore={handleAddReviewAndScore} />
                </View>
                <Text style={{backgroundColor:"#151715",color: "#151715"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi 
                </Text>
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
    },
    backButton: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1,
        marginTop: 20,
        marginLeft: 340,
    },
    container: {
        flex: 1,
        backgroundColor: "#151715",
        alignItems: "center",
        justifyContent: "center",
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    scoresection: { 
        flexDirection: 'row', 
    },
    releaseDate: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 10,
    },
    genres: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 300,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    SectionColor: {
        backgroundColor: "#393c39",
    },
    description: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 20,
        padding: 15,
    },
    section: {
        width: "90%",
        marginTop: 20,
        padding: 15,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    castItem: {
        marginBottom: 5,
    },
    castName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    castCharacter: {
        fontSize: 14,
        color: "#ccc",
    },
    reviewItem: {
        marginBottom: 15,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewAuthor: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    reviewActions: {
        flexDirection: 'row',
        marginRight: 10,
    },
    reviewDate: {
        fontSize: 12,
        color: '#ccc',
        marginBottom: 5,
    },
    reviewQuote: {
        fontSize: 14,
        color: '#ddd',
    },
    reviewRatingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    reviewRatingLabel: {
        fontSize: 14,
        color: '#fff',
        marginRight: 5,
    },
    reviewRating: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    noDataText: {
        color: '#888',
        fontStyle: 'italic',
    },
    loadingIndicator: {
        marginLeft: 10,
    },
});

export default MovieDetails;
