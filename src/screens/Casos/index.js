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
  const [sortOrder, setSortOrder] = useState('recent');
  const [selectedResponsible, setSelectedResponsible] = useState('all');
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
      const casosData = response.data;

      // Buscar detalhes dos responsáveis apenas se for admin
      const casosComResponsaveis = await Promise.all(
        casosData.map(async (caso) => {
          if (isAdmin && caso.responsible) {
            try {
              const userResponse = await api.get(`/api/users/${caso.responsible}`);
              return { ...caso, responsible: userResponse.data };
            } catch (err) {
              console.error('Erro ao buscar detalhes do responsável:', err);
              return caso;
            }
          }
          return caso;
        })
      );

      setCasos(casosComResponsaveis);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar casos:', err);
      setError('Erro ao carregar casos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasos();
  }, [statusFilter, responsavelFilter, ordenacao]);

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

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.titleCell]}>Título</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Abertura</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {casos.map((caso) => (
          <View key={caso._id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.titleCell]}>{caso.title}</Text>
            <View style={styles.cell}>
              {getStatusIcon(caso.status)}
            </View>
            <Text style={styles.cell}>{formatDate(caso.openingDate)}</Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDetalhes(caso)}
              >
                <Icon name="assignment" size={24} color="#357bd2" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
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
    marginBottom: 20,
  },
  filterItem: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 100,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#357bd2",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  titleCell: {
    flex: 2,
  },
  actionsCell: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    padding: 5,
    minWidth: 40,
    alignItems: "center",
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
}); 