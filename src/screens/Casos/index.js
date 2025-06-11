import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import api from "../../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwtDecode from 'jwt-decode';

export default function Casos() {
  const navigation = useNavigation();
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [responsavelFilter, setResponsavelFilter] = useState("");
  const [ordenacao, setOrdenacao] = useState("Mais recentes");
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responsaveis, setResponsaveis] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchCasos();
      getUserRole();
    }, [])
  );

  const getUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode.jwtDecode(token);
        setUserRole(decoded.role);
        if (decoded.role === 'admin') {
          fetchResponsives();
        }
      }
    } catch (error) {
      console.error('Erro ao obter role do usuário:', error);
    }
  };

  const isAdmin = userRole === 'admin';

  const fetchResponsives = async () => {
    try {
      const response = await api.get('/api/users');
      const usuarios = response.data.filter(user => 
        user.role === 'admin' || user.role === 'perito'
      );
      setResponsaveis(usuarios);
    } catch (err) {
      console.error("Erro ao buscar responsáveis:", err);
    }
  };

  const fetchCasos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cases');
      let casosData = response.data;

      // Buscar detalhes dos responsáveis para todos os casos
      const casosComResponsaveis = await Promise.all(
        casosData.map(async (caso) => {
          if (caso.responsible) {
            try {
              const userResponse = await api.get(`/api/users/${caso.responsible}`);
              return { ...caso, responsible: userResponse.data };
            } catch (err) {
              console.error('Erro ao buscar detalhes do responsável:', err);
              return { ...caso, responsible: { name: 'Responsável não encontrado' } };
            }
          }
          return { ...caso, responsible: { name: 'Não atribuído' } };
        })
      );

      // Ordenar os casos
      casosComResponsaveis.sort((a, b) => {
        const dateA = new Date(a.openingDate);
        const dateB = new Date(b.openingDate);
        return ordenacao === "Mais recentes" ? dateB - dateA : dateA - dateB;
      });

      setCasos(casosComResponsaveis);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar casos:', err);
      setError('Erro ao carregar casos');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedCasos = () => {
    let filtered = [...casos];

    // Aplicar filtro de status
    if (statusFilter !== "Todos") {
      filtered = filtered.filter(caso => caso.status === statusFilter);
    }

    // Aplicar filtro de responsável
    if (responsavelFilter) {
      filtered = filtered.filter(caso => caso.responsible?._id === responsavelFilter);
    }

    // Ordenar os casos
    filtered.sort((a, b) => {
      const dateA = new Date(a.openingDate);
      const dateB = new Date(b.openingDate);
      return ordenacao === "Mais recentes" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const formatStatus = (status) => {
    switch (status) {
      case "em_andamento":
        return "Em andamento";
      case "finalizado":
        return "Finalizado";
      case "arquivado":
        return "Arquivado";
      default:
        return status;
    }
  };

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

  const handleDetalhes = (caso) => {
    navigation.navigate("DetalhesCaso", { caso });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
      <Text style={styles.title}>Gerenciamento de Casos</Text>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={statusFilter}
              onValueChange={(itemValue) => setStatusFilter(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Todos" value="Todos" />
              <Picker.Item label="Arquivado" value="arquivado" />
              <Picker.Item label="Em andamento" value="em_andamento" />
              <Picker.Item label="Finalizado" value="finalizado" />
            </Picker>
          </View>
        </View>

        {isAdmin && (
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>Responsável</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={responsavelFilter}
                onValueChange={(itemValue) => setResponsavelFilter(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Todos" value="" />
                {responsaveis.map((responsavel) => (
                  <Picker.Item 
                    key={responsavel._id} 
                    label={responsavel.name} 
                    value={responsavel._id} 
                  />
                ))}
              </Picker>
            </View>
          </View>
        )}

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Ordenar por</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ordenacao}
              onValueChange={(itemValue) => setOrdenacao(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Mais recentes" value="Mais recentes" />
              <Picker.Item label="Mais antigos" value="Mais antigos" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {getFilteredAndSortedCasos().map((caso, index) => (
          <TouchableOpacity
            key={caso._id}
            style={[
              styles.card,
              { backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e8f0f8' }
            ]}
            onPress={() => handleDetalhes(caso)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{caso.title}</Text>
              <View style={styles.statusContainer}>
                {getStatusIcon(caso.status)}
                <Text style={styles.statusText}>{formatStatus(caso.status)}</Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Data de Abertura:</Text>
                <Text style={styles.infoValue}>{formatDate(caso.openingDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Responsável:</Text>
                <Text style={styles.infoValue}>{caso.responsible?.name || 'Não atribuído'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Margem para o Tab Navigator */}
      <View style={styles.bottomMargin} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  filterItem: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#357bd2',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  cardsContainer: {
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  cardInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomMargin: {
    height: 100,
  },
}); 