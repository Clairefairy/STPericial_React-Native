import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../services/api";

export default function Favoritos() {
  const navigation = useNavigation();
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavoritos = async () => {
    try {
      setLoading(true);
      const favoritosIds = await AsyncStorage.getItem('favoritos');
      if (!favoritosIds) {
        setFavoritos([]);
        return;
      }

      const ids = JSON.parse(favoritosIds);
      const response = await api.get('/api/cases');
      const casosFavoritos = response.data.filter(caso => ids.includes(caso._id));
      setFavoritos(casosFavoritos);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar favoritos");
      console.error("Erro ao buscar favoritos:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchFavoritos();
    }, [])
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "em_andamento":
        return <MaterialCommunityIcons name="briefcase-clock" size={20} color="#FFD700" />;
      case "finalizado":
        return <MaterialCommunityIcons name="briefcase-check" size={20} color="#87c05e" />;
      case "arquivado":
        return <FontAwesome5 name="archive" size={20} color="#FFA500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleDetalhes = (caso) => {
    navigation.navigate("DetalhesCaso", { caso });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#357bd2" />
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
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Casos Favoritos</Text>
      </View>
      
      {favoritos.length > 0 ? (
        favoritos.map((caso) => (
          <TouchableOpacity
            key={caso._id}
            style={styles.card}
            onPress={() => handleDetalhes(caso)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{caso.title}</Text>
              {getStatusIcon(caso.status)}
            </View>
            <Text style={styles.cardDate}>
              Aberto em: {formatDate(caso.openingDate)}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noFavoritos}>
          Nenhum caso favoritado
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#357bd2",
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  cardDate: {
    fontSize: 14,
    color: "#666",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  noFavoritos: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 20,
    marginHorizontal: 20,
  },
}); 