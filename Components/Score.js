import { View, Text, StyleSheet } from "react-native";

export function Score({ score, maxScore }) {
  const getColors = () => {
    if (score === 0) {
      return { bg: "#E5E7EB", color: "#6B7280" }; // gris
    }

    const percentage = (score / maxScore) * 10;

    if (percentage >= 7) return { bg: "#DCFCE7", color: "#166534" }; // verde pastel
    if (percentage >= 4) return { bg: "#FEF9C3", color: "#92400E" }; // amarillo pastel
    return { bg: "#FEE2E2", color: "#B91C1C" }; // rojo pastel
  };

  const { bg, color } = getColors();

  return (
    <View style={[styles.scoreContainer, { backgroundColor: bg }]}>
      <Text style={[styles.scoreText, { color }]}>{score === 0 ? "-" : score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginVertical: 4,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
