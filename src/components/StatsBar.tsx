import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { GroceryItem } from "../../types";

interface StatsBarProps {
  items: GroceryItem[];
}

export default function StatsBar({ items }: StatsBarProps) {
  const total = items.length;
  const purchased = items.filter((item) => item.completed).length;
  const pending = total - purchased;

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={styles.statNumber}>{total}</Text>
        <Text style={styles.statLabel}>Totales</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={[styles.statNumber, { color: "#f4511e" }]}>{pending}</Text>
        <Text style={styles.statLabel}>Pendientes</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.statBox}>
        <Text style={[styles.statNumber, { color: "#2E7D32" }]}>{purchased}</Text>
        <Text style={styles.statLabel}>Comprados</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8A2BE2",
  },
  statLabel: {
    fontSize: 12,
    color: "#666666",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: "60%",
    backgroundColor: "#E0E0E0",
  },
});