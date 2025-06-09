import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwtDecode from 'jwt-decode';
import api from "../../services/api";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode.jwtDecode(token);
        const response = await api.get(`/api/users/${decoded.id}`);
        setUser(response.data);
      }
    } catch (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      setError("Erro ao carregar dados do usuário");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <MaterialCommunityIcons name="shield-crown" size={80} color="#357bd2" />;
      case 'perito':
        return <MaterialCommunityIcons name="police-badge" size={80} color="#357bd2" />;
      case 'assistente':
        return <MaterialCommunityIcons name="magnify" size={80} color="#357bd2" />;
      default:
        return <MaterialCommunityIcons name="account" size={80} color="#357bd2" />;
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'perito':
        return 'Perito';
      case 'assistente':
        return 'Assistente';
      default:
        return 'Não definido';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Perfil do Usuário</Text>

      <View style={styles.iconContainer}>
        {getRoleIcon(user?.role)}
      </View>

      <View style={styles.card}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{user?._id || "Não informado"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.value}>{user?.name || "Não informado"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>E-mail:</Text>
          <Text style={styles.value}>{user?.email || "Não informado"}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>Tipo:</Text>
          <Text style={styles.value}>{formatRole(user?.role)}</Text>
        </View>
      </View>
    </ScrollView>
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a2d5a",
    marginBottom: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
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
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
