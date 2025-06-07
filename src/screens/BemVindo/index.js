import React from "react";

import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// Importando Animatable para animações
import * as Animatable from "react-native-animatable";
// NAVEGAÇÃO PARA A TELA DE LOGIN
import { useNavigation } from "@react-navigation/native";

export default function Bemvindo() {
  // FUNÇÃO PARA NAVEGAR PARA A TELA DE LOGIN "Botão Acessar"
  const navigation = useNavigation();

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
          Gestão eficiente e segura de laudos periciais
        </Text>
        <Text style={styles.text}> Faça o login para acessar</Text>
        <TouchableOpacity style={styles.button}>
          <Text
            onPress={() => navigation.navigate("Login")} // NAVEGAÇÃO PARA A TELA DE LOGIN
            style={styles.buttonText}
          >
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
    fontSize: 24, //TAMANHO DA FONTE "Gstão eficiente e segura de laudos periciais"
    fontWeight: "bold",
    marginTop: 22,
    marginBottom: 12,
    color: "#000",
  },
  text: {
    color: "#a1a1a1",
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
