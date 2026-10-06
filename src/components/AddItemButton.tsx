import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';

type AddItemButtonProps = {
  onPress: () => void;
};

export default function AddItemButton({ onPress }: AddItemButtonProps) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={styles.button}
      labelStyle={styles.label}
    >
      +
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    width: 60,
    height: 60,
    backgroundColor: "#5d2294",
    marginBottom: 30,
  },
  label: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 28,
  },
});