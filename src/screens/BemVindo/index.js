import React from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// Importando Animatable para animações
import * as Animatable from "react-native-animatable";
// NAVEGAÇÃO PARA A TELA DE LOGIN
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Bemvindo() {
  // FUNÇÃO PARA NAVEGAR PARA A TELA DE LOGIN "Botão Acessar"
  const navigation = useNavigation();

  const handleAcessar = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const rememberMe = await AsyncStorage.getItem('rememberMe');
      if (token && rememberMe === 'true') {
        navigation.navigate("MainApp");
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error('Erro ao verificar login:', error);
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>Tela Bem vindo</Text> */}
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="flipInY" // aANIMAÇÃO DA LOGO
          duration={2500} // DURAÇÃO DA ANIMAÇÃO
          resizeMode="contain"
          source={require("../../assets/STPericial_sem_fundo.png")}
          style={{ width: "80%" }} // AJUSTEA LARGURA DA LOGO
        />
      </View>

      <Animatable.View
        delay={600}
        animation="fadeInUp"
        style={styles.containerForm}
      >
        <Text style={styles.title}>
          Bem-vindo ao STPericial
        </Text>
        <Text style={styles.subtitle}>
          Sua plataforma completa para gestão de laudos periciais
        </Text>
        <Text style={styles.text}>Entre para acessar o sistema</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleAcessar}
        >
          <Text style={styles.buttonText}>
            Acessar
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}
// ESTILIZAÇÃO DO COMPONENTE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#357bd2",
  },
  containerLogo: {
    flex: 2,
    backgroundColor: "#357bd2",
    justifyContent: "center",
    alignItems: "center",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: "5%",
    paddingEnd: "5%",
    marginTop: -30, //AJUSTE DE AREA DE TEXTO
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 12,
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
    color: "#357bd2",
    textAlign: "center",
  },
  text: {
    color: "#a1a1a1",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    position: "absolute",
    backgroundColor: "#87c05e",
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 102,
    alignSelf: "center",
    bottom: 60, // ALTURA DO BOTÃO
    alignItems: "center",
    justifyContent: "center",

    // ADICIONANDO SOMBRA PARA O BOTÃO
    shadowColor: "#000", // Cor da sombra (preta)
    shadowOffset: { width: 0, height: 4 }, // Direção e distância da sombra
    shadowOpacity: 0.3, // Intensidade da sombra
    shadowRadius: 4, // Difusão da sombra

    // Sombra para Android
    elevation: 6, // Quanto maior o valor, mais intensa a sombra
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});
