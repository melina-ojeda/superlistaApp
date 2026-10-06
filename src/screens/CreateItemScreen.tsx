import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { RootStackParamList } from "../../types";
import { useGroceryList } from "../hooks/useGroceryList";

type Props = NativeStackScreenProps<RootStackParamList, "CreateItem">;

export default function CreateItemScreen({ navigation }: Props) {
  const [text, setText] = useState("");
  const { addItem } = useGroceryList();

  const handleAdd = async () => {
    if (!text.trim()) return;
    await addItem(text);
    setText("");
    Keyboard.dismiss();
    navigation.goBack();
  };

  const handleCancel = () => {
    setText("");
    Keyboard.dismiss();
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Agrega un item</Text>
        <Text style={styles.subtitle}>¿Qué te falta comprar?</Text>

        <TextInput
          style={styles.input}
          placeholder="Escribí el nombre del producto"
          placeholderTextColor="#8E8E93"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={40}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          selectionColor="#8A2BE2"
          autoFocus
        />

        <Text style={styles.counter}>{text.length}/40</Text>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, !text.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!text.trim()}
          >
            <Text style={styles.addText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 14,
    color: "#000000",
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  counter: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "right",
    marginTop: 6,
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "600",
  },
  addBtn: {
    flex: 2,
    backgroundColor: "#8A2BE2",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  addBtnDisabled: {
    backgroundColor: "#B388FF",
    opacity: 0.6,
  },
  addText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});