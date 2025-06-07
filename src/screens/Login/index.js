import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

// NAVEGAÇÃO PARA A TELA DE CADASTRO
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/MaterialIcons";

import * as Animatable from "react-native-animatable";

export default function Login() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Animatable.View
        style={styles.containerHeader}
        animation="fadeInLeft"
        delay={500}
        duration={1500}
      >
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>
      {/* Imagem do Logo */}
      {/* Container para imagem */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/STPericial_sem_fundo.png")}
          style={styles.image}
          resizeMethod="contain"
        />
      </View>
      <Animatable.View
        animation="fadeInUp"
        delay={500}
        duration={1500}
        style={styles.containerForm}
      >
        <Text style={styles.titleImput}>Email</Text>
        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="gray" style={styles.icon} />
          <TextInput
            keyboardType="email-address"
            style={styles.input}
            placeholder="Digite seu email..."
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.titleImput}>Senha</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="gray" style={styles.icon} />
          <TextInput
            keyboardType="default"
            textContentType="password"
            style={styles.input}
            placeholder="Digite sua senha..."
            autoCorrect={false}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity 
          style={styles.buttonLogin}
          onPress={() => navigation.navigate("MainApp")}
        >
          <Text style={styles.textButtonLogin}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonCadastro}>
          <Text
            onPress={() => navigation.navigate("Cadastro")}
            style={styles.textButtonCadastro}
          >
            Não possui uma conta? Cadastre-se
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#357bd2", //COR BRANCO PURO
  },
  containerHeader: {
    flex: 1,
    marginTop: "20%",
    marginBottom: "2%", // MARGEM SUPERIOR E INFERIOR
    paddingStart: "5%", // MARGEM INICIAL
    paddingEnd: "5%", // MARGEM FINAL
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff", // COR PRETA
  },
  containerForm: {
    flex: 2,
    backgroundColor: "#FFF", // COR BRANCA
    borderTopLeftRadius: 30, // RAIO DE BORDA SUPERIOR ESQUERDO
    borderTopRightRadius: 30, // RAIO DE BORDA SUPERIOR DIREITO
    paddingStart: "5%", // MARGEM INICIAL
    paddingEnd: "5%", // MARGEM FINAL
    paddingTop: "5%", // MARGEM SUPERIOR
    marginTop: "-30%",
  },
  titleImput: {
    marginTop: 10, // MARGEM SUPERIOR
    fontSize: 20,
    marginBottom: 10,
    color: "#000", // COR PRETA
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#000", // COR PRETA
    borderRadius: 8, // RAIO DE BORDA
    paddingHorizontal: 10, // PADDING HORIZONTAL
    marginBottom: 20, // MARGEM INFERIOR
    backgroundColor: "#e7f0e9", // COR VERDE CLARO
    T4extAlign: "left", // ALINHAMENTO À ESQUERDA
  },
  buttonLogin: {
    backgroundColor: "#87c05e", // COR VERDE
    borderRadius: 50, // RAIO DE BORDA
    paddingVertical: 12, // PADDING VERTICAL
    alignItems: "center", // ALINHAMENTO CENTRAL
    justifyContent: "center", // JUSTIFICATIVA CENTRAL
    marginTop: 20, // MARGEM SUPERIOR
    marginBottom: 10, // MARGEM INFERIOR

    // ADICIONANDO EFEITO DE SOMBRA
    shadowColor: "#000", // Cor da sombra (preta)
    shadowOffset: { width: 0, height: 4 }, // Direção e distância da sombra
    shadowOpacity: 0.3, // Intensidade da sombra
    shadowRadius: 4, // Difusão da sombra
    // Sombra para Android
    elevation: 6, // Quanto maior o valor, mais intensa a sombra
  },
  textButtonLogin: {
    color: "#fff", // COR BRANCA
    fontSize: 20, // TAMANHO DA FONTE DO BOTÃO LOGIN
    fontWeight: "bold", // NEGRITO
    textAlign: "center", // ALINHAMENTO CENTRAL
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#e7f0e9",
    marginBottom: 20,
    height: 40,
  },
  icon: {
    marginRight: 8,
    color: "#357bd2", // COR DO ÍCONE DE EMAIL OU SENHA
    alignSelf: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  // ALTEREI HOJE BOTÃO DE DE CADASTRO
  textButtonCadastro: {
    color: "#a1a1a1", // COR CINZA CLARO
    fontSize: 16, // TAMANHO DA FONTE DO BOTÃO CADASTRO
    textAlign: "center", // ALINHAMENTO CENTRAL
    marginTop: 10, // MARGEM SUPERIOR
    marginBottom: 20, // MARGEM INFERIOR
    fontWeight: "bold", // NEGRITO
  },

  imageContainer: {
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -120,
    marginBottom: 140,
  },
  image: {
    width: "60%",
    height: 150,
    resizeMode: "contain",
  },
});
