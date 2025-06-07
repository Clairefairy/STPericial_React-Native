// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Image,
// } from "react-native";

// // NAVEGAÇÃO PARA A TELA DE CADASTRO
// import { useNavigation } from "@react-navigation/native";

// import Icon from "react-native-vector-icons/MaterialIcons";
// import * as Animatable from "react-native-animatable";

// export default function Cadastro({ navigation }) {
//   // FUNÇÃO PARA NAVEGAR PARA A TELA DE CADASTRO "Botão Cadastrar"

//   return (
//     <View style={styles.container}>
//       <Animatable.View
//         style={styles.containerHeader}
//         animation="fadeInLeft"
//         delay={500}
//         duration={1500}
//       >
//         <Text style={styles.message}>Crie sua conta</Text>
//       </Animatable.View>

//       <View style={styles.imageContainer}>
//         <Image
//           source={require("../../assets/STPericial_sem_fundo.png")}
//           style={styles.image}
//           resizeMethod="contain"
//         />
//       </View>

//       <Animatable.View
//         animation="fadeInUp"
//         delay={500}
//         duration={1500}
//         style={styles.containerForm}
//       >
//         <Text style={styles.titleImput}>Nome completo</Text>
//         <View style={styles.inputContainer}>
//           <Icon name="person" size={24} style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Digite seu nome..."
//             autoCorrect={false}
//           />
//         </View>

//         <Text style={styles.titleImput}>Email</Text>
//         <View style={styles.inputContainer}>
//           <Icon name="email" size={24} style={styles.icon} />
//           <TextInput
//             keyboardType="email-address"
//             style={styles.input}
//             placeholder="Digite seu email..."
//             autoCorrect={false}
//             autoCapitalize="none"
//           />
//         </View>

//         <Text style={styles.titleImput}>Senha</Text>
//         <View style={styles.inputContainer}>
//           <Icon name="lock" size={24} style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Digite sua senha..."
//             secureTextEntry
//             autoCorrect={false}
//             autoCapitalize="none"
//           />
//         </View>

//         <Text style={styles.titleImput}>Confirmar Senha</Text>
//         <View style={styles.inputContainer}>
//           <Icon name="lock-outline" size={24} style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Confirme sua senha..."
//             secureTextEntry
//             autoCorrect={false}
//             autoCapitalize="none"
//           />
//         </View>

//         <TouchableOpacity style={styles.buttonRegister}>
//           <Text style={styles.textButtonRegister}>Cadastrar</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.buttonCadastro}
//           onPress={() => navigation.navigate("Login")}
//         >
//           <Text style={styles.textButtonCadastro}>
//             Já possui uma conta? Faça login
//           </Text>
//         </TouchableOpacity>
//       </Animatable.View>
//     </View>
//   );
// }

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleCadastro = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    // Aqui você pode enviar os dados para o backend ou banco de dados
    Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    // navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        style={styles.containerHeader}
        animation="fadeInLeft"
        delay={500}
        duration={1500}
      >
        <Text style={styles.message}>Crie sua conta</Text>
      </Animatable.View>

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
        <Text style={styles.titleImput}>Nome completo</Text>
        <View style={styles.inputContainer}>
          <Icon name="person" size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome..."
            autoCorrect={false}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <Text style={styles.titleImput}>Email</Text>
        <View style={styles.inputContainer}>
          <Icon name="email" size={24} style={styles.icon} />
          <TextInput
            keyboardType="email-address"
            style={styles.input}
            placeholder="Digite seu email..."
            autoCorrect={false}
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.titleImput}>Senha</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha..."
            secureTextEntry
            autoCorrect={false}
            autoCapitalize="none"
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        <Text style={styles.titleImput}>Confirmar Senha</Text>
        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={24} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirme sua senha..."
            secureTextEntry
            autoCorrect={false}
            autoCapitalize="none"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />
        </View>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={handleCadastro}
        >
          <Text style={styles.textButtonRegister}>Cadastrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonCadastro}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.textButtonCadastro}>
            Já possui uma conta? Faça login
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
  containerHeader: {
    flex: 1,
    backgroundColor: "#357bd2",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "-4%",
    marginBottom: "5%", // MARGEM SUPERIOR E INFERIOR
    paddingStart: "5%", // MARGEM INICIAL
    paddingEnd: "5%", // MARGEM FINAL
  },
  message: {
    fontSize: 34,
    color: "#fff",
    fontWeight: "bold",
  },

  imageContainer: {
    // flex: 2,
    // justifyContent: "center",
    // alignItems: "center",
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -60, // POSICIONAMENTO DA IMAGEM
    marginBottom: 10, // MARGEM INFERIOR
  },
  image: {
    // width: "100%",
    // height: "100%",
    width: "60%",
    height: 150,
    resizeMode: "contain",
  },
  containerForm: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingStart: "5%",
    paddingEnd: "5%",
    paddingTop: "8%",
  },
  titleImput: {
    fontSize: 20,
    color: "#000",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
    color: "#357bd2", // COR DO ÍCONE DE EMAIL OU SENHA
    alignSelf: "center",
  },
  input: {
    flexGrow: 1,
    height: 40,
    backgroundColor: "#e7f0e9", // COR VERDE CLARO
  },
  buttonRegister: {
    backgroundColor: "#87c05e",
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 2, // BOTÃO DE CADASTRO PARA SUBIR
    // ADICIONANDO EFEITO DE SOMBRA
    // Sombra (funciona melhor no iOS)
    shadowColor: "#000", // Cor da sombra (preta)
    shadowOffset: { width: 0, height: 4 }, // Direção e distância da sombra
    shadowOpacity: 0.3, // Intensidade da sombra
    shadowRadius: 4, // Difusão da sombra

    // Sombra para Android
    elevation: 6, // Quanto maior o valor, mais intensa a sombra
  },
  textButtonRegister: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20, // TAMANHO DA FONTE DO BOTÃO LOGIN
  },
  buttonCadastro: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textButtonCadastro: {
    color: "#a1a1a1", // COR CINZA CLARO
    fontSize: 16, // TAMANHO DA FONTE DO BOTÃO "Já possui uma conta? Faça login"
    textAlign: "center", // ALINHAMENTO CENTRAL
  },
});
