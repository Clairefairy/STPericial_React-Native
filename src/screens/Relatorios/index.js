import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

export default function Relatorios() {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    fetchRelatorios();
  }, []);

  const fetchRelatorios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/genRecord');
      setRelatorios(response.data);

      // Extrair IDs únicos dos usuários
      const userIds = [...new Set(response.data.map(relatorio => relatorio.user._id))];
      console.log('IDs dos usuários encontrados:', userIds);

      // Criar um mapa direto dos nomes dos usuários
      const userNamesMap = response.data.reduce((acc, relatorio) => {
        if (relatorio.user && relatorio.user._id) {
          acc[relatorio.user._id] = relatorio.user.name || relatorio.user.email || 'Usuário não encontrado';
        }
        return acc;
      }, {});

      console.log('Mapa de nomes de usuários:', userNamesMap);
      setUserNames(userNamesMap);
    } catch (err) {
      console.error("Erro ao buscar relatórios:", err);
      setError("Erro ao carregar relatórios");
      Alert.alert('Erro', 'Não foi possível carregar os relatórios');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
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
      <Text style={styles.title}>Gerenciamento de Relatórios</Text>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.titleCell]}>Título</Text>
          <Text style={[styles.headerCell, styles.authorCell]}>Autor</Text>
          <Text style={[styles.headerCell, styles.dateCell]}>Data de Emissão</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {relatorios.map((relatorio) => (
          <View key={relatorio._id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.titleCell]}>
              {relatorio.title || 'Sem título'}
            </Text>
            <Text style={[styles.cell, styles.authorCell]}>
              {relatorio.user?.name || relatorio.user?.email || 'Autor não encontrado'}
            </Text>
            <Text style={[styles.cell, styles.dateCell]}>
              {formatDate(relatorio.creationDate)}
            </Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="assignment" size={24} color="#357bd2" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Margem para o Tab Navigator */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 150,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#357bd2',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleCell: {
    flex: 2,
  },
  authorCell: {
    flex: 1.5,
  },
  dateCell: {
    flex: 1,
  },
  actionsCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
    minWidth: 40,
    alignItems: 'center',
  },
  bottomPadding: {
    height: 80,
  },
}); 