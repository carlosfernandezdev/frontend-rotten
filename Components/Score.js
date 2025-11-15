import { View, Text, StyleSheet } from "react-native";

export function Score({ score, maxScore }) {
  const getColor = () => {
    if (score === 0) return 'gray';
    const percentage = (score / maxScore) * 10;
    if (percentage >= 7) return 'green';
    if (percentage >= 4) return 'orange';
    return 'red';
  };

  return (
    <View style={styles.scoreContainer}>
      <Text style={[styles.score, { color: getColor() }]}>
        {score === 0 ? '-' : score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scoreContainer: {
    padding: 2,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
});