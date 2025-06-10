import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwtDecode from 'jwt-decode';
import ModalVitima from '../../components/ModalVitima';
import ModalDetalhesVitima from '../../components/ModalDetalhesVitima';
import api from '../../services/api';

const SEXO_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Feminino', value: 'feminino' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Outro', value: 'outro' },
];

const ETNIA_OPTIONS = [
  { label: 'Todas', value: '' },
  { label: 'Branca', value: 'branca' },
  { label: 'Parda', value: 'parda' },
  { label: 'Preta', value: 'preta' },
  { label: 'Indígena', value: 'indigena' },
  { label: 'Amarela', value: 'amarela' },
  { label: 'Outro', value: 'outro' },
];

export default function GerenciarVitimas() {
  const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [vitimaSelecionada, setVitimaSelecionada] = useState(null);
  const [vitimas, setVitimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroSexo, setFiltroSexo] = useState('');
  const [filtroEtnia, setFiltroEtnia] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    fetchVitimas();
    getUserRole();
  }, []);

  const getUserRole = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode.jwtDecode(token);
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error('Erro ao obter role do usuário:', error);
    }
  };

  const canEdit = userRole === 'admin' || userRole === 'perito';

  const fetchVitimas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/victims');
      setVitimas(response.data);
    } catch (error) {
      console.error('Erro ao buscar vítimas:', error);
      setError('Erro ao carregar vítimas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetalhes = async (vitima) => {
    try {
      const response = await api.get(`/api/victims/${vitima._id}`);
      setVitimaSelecionada(response.data);
      setModalDetalhesVisible(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes da vítima:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da vítima.');
    }
  };

  const handleDeleteVitima = async () => {
    await fetchVitimas();
  };

  const handleEditVitima = async () => {
    await fetchVitimas();
  };

  const handleSaveVitima = async (novaVitima) => {
    try {
      await fetchVitimas();
      Alert.alert('Sucesso', 'Vítima cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar lista de vítimas:', error);
    }
  };

  const getSexoLabel = (sexo) => {
    switch (sexo?.toLowerCase()) {
      case 'masculino':
        return 'M';
      case 'feminino':
        return 'F';
      case 'outro':
        return 'O';
      default:
        return sexo || 'N/A';
    }
  };

  const vitimasFiltradas = vitimas.filter(vitima => {
    const matchSexo = !filtroSexo || vitima.sex?.toLowerCase() === filtroSexo.toLowerCase();
    const matchEtnia = !filtroEtnia || vitima.ethnicity?.toLowerCase() === filtroEtnia.toLowerCase();
    return matchSexo && matchEtnia;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Gerenciamento de Vítimas</Text>

      <View style={styles.filtrosContainer}>
        <View style={styles.filtroGroup}>
          <Text style={styles.filtroLabel}>Sexo</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtroSexo}
              onValueChange={(value) => setFiltroSexo(value)}
              style={styles.picker}
            >
              {SEXO_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.filtroGroup}>
          <Text style={styles.filtroLabel}>Etnia</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filtroEtnia}
              onValueChange={(value) => setFiltroEtnia(value)}
              style={styles.picker}
            >
              {ETNIA_OPTIONS.map((option) => (
                <Picker.Item
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {canEdit && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalCadastroVisible(true)}
        >
          <Feather name="user-plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Cadastrar Vítima</Text>
        </TouchableOpacity>
      )}

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.nomeCell]}>Nome</Text>
          <Text style={styles.headerCell}>Sexo</Text>
          <Text style={styles.headerCell}>Etnia</Text>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#357bd2" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchVitimas}>
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tableBody}>
            {vitimasFiltradas.map((vitima) => (
              <View key={vitima._id} style={styles.tableRow}>
                <Text style={[styles.cell, styles.nomeCell]}>{vitima.name || 'Sem nome'}</Text>
                <Text style={styles.cell}>{getSexoLabel(vitima.sex)}</Text>
                <Text style={styles.cell}>{vitima.ethnicity || 'N/A'}</Text>
                <View style={styles.cell}>
                  {vitima.identified ? (
                    <Icon name="check-circle" size={24} color="#87c05e" />
                  ) : (
                    <Icon name="cancel" size={24} color="#ff4444" />
                  )}
                </View>
                <View style={styles.actionsCell}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleOpenDetalhes(vitima)}
                  >
                    <Icon name="assignment" size={24} color="#357bd2" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />

      <ModalVitima
        visible={modalCadastroVisible}
        onClose={() => setModalCadastroVisible(false)}
        onSave={handleSaveVitima}
      />

      <ModalDetalhesVitima
        visible={modalDetalhesVisible}
        onClose={() => setModalDetalhesVisible(false)}
        vitima={vitimaSelecionada}
        onDelete={handleDeleteVitima}
        onEdit={handleEditVitima}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#357bd2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  filtroGroup: {
    flex: 1,
  },
  filtroLabel: {
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
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#357bd2',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nomeCell: {
    flex: 2,
  },
  tableBody: {
    minHeight: 200,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsCell: {
    flex: 0.5,
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
  },
  loadingContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#357bd2',
    padding: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomPadding: {
    height: 80,
  },
}); 