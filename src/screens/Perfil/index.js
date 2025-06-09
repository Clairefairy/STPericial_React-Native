// import React from "react";
// import { View, Text, StyleSheet } from "react-native";

// export default function Perfil() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Perfil</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#357bd2",
//   },
// });
//=============================================================================
// import React, { useState } from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

// export default function Perfil() {
//   const [user] = useState({
//     id: "USR-001",
//     nome: "João da Silva",
//     email: "joao.silva@example.com",
//     tipo: "Perito", // ou "Admin", "Assistente"
//   });

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Perfil do Usuário</Text>

//       <Image
//         source={require("../../assets/user-default.png")}
//         style={styles.profileImage}
//       />

//       <View style={styles.card}>
//         <InfoItem label="ID" value={user.id} />
//         <InfoItem label="Nome" value={user.nome} />
//         <InfoItem label="E-mail" value={user.email} />
//         <InfoItem label="Tipo de Usuário" value={user.tipo} />
//       </View>

//       <TouchableOpacity style={styles.editButton}>
//         <Text style={styles.editText}>Editar Perfil</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// function InfoItem({ label, value }) {
//   return (
//     <View style={styles.infoItem}>
//       <Text style={styles.label}>{label}:</Text>
//       <Text style={styles.value}>{value}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f7fa",
//     alignItems: "center",
//     paddingTop: 10,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#1a2d5a",
//     marginBottom: 10,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 65,
//     borderWidth: 3,
//     borderColor: "#357bd2",
//     marginBottom: 5,
//   },
//   card: {
//     width: "85%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 20,
//     elevation: 4, // sombra Android
//     shadowColor: "#000", // sombra iOS
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//     marginBottom: 20,
//   },
//   infoItem: {
//     flexDirection: "row",
//     marginVertical: 8,
//   },
//   label: {
//     fontWeight: "600",
//     color: "#444",
//     width: 130,
//   },
//   value: {
//     color: "#222",
//     fontSize: 16,
//   },
//   editButton: {
//     backgroundColor: "#357bd2",
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     borderRadius: 10,
//     elevation: 3,
//   },
//   editText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });
//=============================================================================
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function Perfil() {
  const [user] = useState({
    id: "USR-001",
    nome: "João da Silva",
    email: "joao.silva@example.com",
    tipo: "Perito", // ou "Admin", "Assistente"
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      <Image
        source={require("../../assets/user-default.png")}
        style={styles.profileImage}
      />

      <UserCard user={user} />
    </ScrollView>
  );
}

function UserCard({ user }) {
  return (
    <View style={styles.card}>
      <View style={styles.infoItem}>
        <Text style={styles.label}>ID:</Text>
        <Text style={styles.value}>{user.id}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Nome:</Text>
        <Text style={styles.value}>{user.nome}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Tipo:</Text>
        <Text style={styles.value}>{user.tipo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a2d5a",
    marginBottom: -5,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: "#357bd2",
    marginVertical: 15,
    marginBottom: 20,
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 100,
  },
  infoItem: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  label: {
    fontWeight: "600",
    color: "#444",
    width: 130,
  },
  value: {
    color: "#222",
  },
});
