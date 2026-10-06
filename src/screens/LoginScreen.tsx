import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { RootStackParamList } from "../../types";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordInputRef = useRef<any>(null);

  const handleLogin = async () => {
    setError("");

    if (!username.trim() || !password) {
      setError("Por favor, completa todos los campos");
      return;
    }

    try {
      const storedUsername = await AsyncStorage.getItem("username");
      const storedPassword = await AsyncStorage.getItem("password");

      if (storedUsername && storedPassword) {
        if (username.trim() === storedUsername && password === storedPassword) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Home" }],
          });
        } else {
          setError("Credenciales incorrectas");
        }
      } else {
        setError("No hay usuario registrado. Regístrate primero.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>USUARIO</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={styles.inputBox}
          autoCapitalize="none"
          autoFocus={true}
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
          blurOnSubmit={false}
          selectionColor="#5d2294"
          cursorColor="#5d2294"
          textColor="#000000"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
        <TextInput
          ref={passwordInputRef}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="flat"
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={styles.inputBox}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
          selectionColor="#5d2294"
          cursorColor="#5d2294"
          textColor="#000000"
        />
      </View>

      {error ? <HelperText type="error" visible={!!error}>{error}</HelperText> : null}

      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        buttonColor="#5d2294"
        textColor="#FFFFFF"
      >
        Ingresar
      </Button>

      <TouchableOpacity
        onPress={() => navigation.navigate("Registry")}
        style={styles.linkContainer}
        activeOpacity={0.7}
      >
        <Text style={styles.questionText}>¿No tienes cuenta?</Text>
        <Text style={styles.linkText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 36,
    backgroundColor: "#FFFFFF",
  },
  formGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputBox: {
    backgroundColor: "#E5E5E5",
    borderRadius: 4,
    height: 52,
    fontSize: 16,
  },
  button: {
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 4,
  },
  linkContainer: {
    marginTop: 28,
    alignItems: "center",
  },
  questionText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 2,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5d2294",
  },
});