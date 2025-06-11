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

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {vitimasFiltradas.map((vitima, index) => (
          <TouchableOpacity
            key={vitima._id}
            style={[
              styles.card,
              { backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e8f0f8' }
            ]}
            onPress={() => handleOpenDetalhes(vitima)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{vitima.name || 'Sem nome'}</Text>
              <View style={styles.idContainer}>
                {vitima.identified ? (
                  <Icon name="check-circle" size={20} color="#87c05e" />
                ) : (
                  <Icon name="cancel" size={20} color="#ff4444" />
                )}
              </View>
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sexo:</Text>
                <Text style={styles.infoValue}>{getSexoLabel(vitima.sex)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Etnia:</Text>
                <Text style={styles.infoValue}>{vitima.ethnicity || 'N/A'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Margem para o Tab Navigator */}
      <View style={styles.bottomMargin} />

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
  cardsContainer: {
    paddingBottom: 20,
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
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  bottomMargin: {
    height: 80,
  },
}); 