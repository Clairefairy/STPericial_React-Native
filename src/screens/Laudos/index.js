import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import api from "../../services/api";

export default function Laudos() {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedLaudo, setSelectedLaudo] = useState(null);
  const [laudos, setLaudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [sortOrder, setSortOrder] = useState('recent');
  const [selectedResponsible, setSelectedResponsible] = useState('all');
  const [responsibles, setResponsibles] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchLaudos();
      fetchResponsibles();
    }, [])
  );

  const fetchResponsibles = async () => {
    try {
      const response = await api.get('/api/users');
      setResponsibles(response.data);
    } catch (err) {
      console.error('Erro ao buscar responsáveis:', err);
    }
  };

  const getFilteredAndSortedLaudos = () => {
    let filtered = [...laudos];

    // Filtrar por responsável
    if (selectedResponsible !== 'all') {
      filtered = filtered.filter(laudo => 
        laudo.expertResponsible?._id === selectedResponsible
      );
    }

    // Ordenar por data
    filtered.sort((a, b) => {
      const dateA = new Date(a.dateEmission);
      const dateB = new Date(b.dateEmission);
      return sortOrder === 'recent' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const fetchLaudos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/reports');
      const laudosData = response.data;

      // Buscar detalhes dos responsáveis
      const laudosComResponsaveis = await Promise.all(
        laudosData.map(async (laudo) => {
          if (laudo.expertResponsible) {
            try {
              const userResponse = await api.get(`/api/users/${laudo.expertResponsible}`);
              return { ...laudo, expertResponsible: userResponse.data };
            } catch (err) {
              console.error('Erro ao buscar detalhes do responsável:', err);
              return laudo;
            }
          }
          return laudo;
        })
      );

      setLaudos(laudosComResponsaveis);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar laudos:', err);
      setError('Erro ao carregar laudos');
    } finally {
      setLoading(false);
    }
  };

  const handleDetalhes = async (laudo) => {
    try {
      setLoadingDetails(true);
      const response = await api.get(`/api/reports/${laudo._id}`);
      const laudoData = response.data;

      // Buscar detalhes do responsável
      if (laudoData.expertResponsible) {
        try {
          const userResponse = await api.get(`/api/users/${laudoData.expertResponsible}`);
          laudoData.expertResponsible = userResponse.data;
        } catch (err) {
          console.error('Erro ao buscar detalhes do responsável:', err);
          laudoData.expertResponsible = null;
        }
      }

      setSelectedLaudo(laudoData);
      setModalVisible(true);
    } catch (err) {
      console.error('Erro ao buscar detalhes do laudo:', err);
      setError('Erro ao carregar detalhes do laudo');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDownload = () => {
    // Implementar lógica de download
    console.log('Download do laudo:', selectedLaudo._id);
  };

  const handleExcluir = async () => {
    try {
      setLoadingDelete(true);
      await api.delete(`/api/reports/${selectedLaudo._id}`);
      setConfirmModalVisible(false);
      setModalVisible(false);
      fetchLaudos(); // Atualiza a lista após excluir
    } catch (err) {
      console.error('Erro ao excluir laudo:', err);
      setError('Erro ao excluir laudo');
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleExcluirClick = () => {
    setConfirmModalVisible(true);
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
      <Text style={styles.title}>Gerenciamento de Laudos</Text>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Ordenar por:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sortOrder}
              onValueChange={(value) => setSortOrder(value)}
              style={styles.picker}
            >
              <Picker.Item label="Mais recente" value="recent" />
              <Picker.Item label="Mais antigo" value="old" />
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Responsável:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedResponsible}
              onValueChange={(value) => setSelectedResponsible(value)}
              style={styles.picker}
            >
              <Picker.Item label="Todos" value="all" />
              {responsibles.map((responsible) => (
                <Picker.Item 
                  key={responsible._id} 
                  label={responsible.name} 
                  value={responsible._id} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.titleCell]}>Título</Text>
          <Text style={styles.headerCell}>Emissão</Text>
          <Text style={[styles.headerCell, styles.responsavelCell]}>Responsável</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {getFilteredAndSortedLaudos().map((laudo) => (
          <View key={laudo._id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.titleCell]}>{laudo.title}</Text>
            <Text style={styles.cell}>
              {new Date(laudo.createdAt).toLocaleDateString('pt-BR')}
            </Text>
            <Text style={[styles.cell, styles.responsavelCell]}>
              {laudo.expertResponsible?.name || 'Não atribuído'}
            </Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDetalhes(laudo)}
                disabled={loadingDetails}
              >
                {loadingDetails && selectedLaudo?._id === laudo._id ? (
                  <ActivityIndicator size="small" color="#357bd2" />
                ) : (
                  <Icon name="assignment" size={24} color="#357bd2" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Margem para o Tab Navigator */}
      <View style={styles.bottomMargin} />

      {/* Modal de Detalhes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes do Laudo</Text>
            
            <ScrollView style={styles.modalScrollView}>
              <View style={styles.modalInfoContainer}>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Título:</Text>
                  <Text style={styles.modalValue}>{selectedLaudo?.title || 'Não informado'}</Text>
                </View>
                
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Evidência:</Text>
                  <Text style={styles.modalValue}>{selectedLaudo?.evidence || 'Não informado'}</Text>
                </View>
                
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Data de Emissão:</Text>
                  <Text style={styles.modalValue}>
                    {selectedLaudo?.dateEmission ? new Date(selectedLaudo.dateEmission).toLocaleDateString('pt-BR') : 'Não informado'}
                  </Text>
                </View>
                
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Descrição:</Text>
                  <Text style={styles.modalValue}>{selectedLaudo?.description || 'Não informado'}</Text>
                </View>

                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalLabel}>Responsável:</Text>
                  <Text style={styles.modalValue}>
                    {selectedLaudo?.expertResponsible?.name || 'Não atribuído'}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.downloadButton]}
                onPress={handleDownload}
              >
                <FontAwesome5 name="download" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Baixar Laudo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleExcluirClick}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Icon name="delete" size={16} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>Excluir</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        visible={confirmModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModalContent}>
            <Text style={styles.confirmModalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.confirmModalText}>
              Tem certeza que deseja excluir este laudo? Esta ação não pode ser desfeita.
            </Text>
            
            <View style={styles.confirmModalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleExcluir}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Excluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
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
    flex: 1.8,
  },
  responsavelCell: {
    flex: 1.5,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    position: 'relative',
  },
  modalScrollView: {
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInfoContainer: {
    marginBottom: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#357bd2',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff4444',
  },
  closeButton: {
    backgroundColor: '#357bd2',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  confirmModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  confirmModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#666',
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
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 45,
    justifyContent: 'center',
  },
  picker: {
    height: 45,
    fontSize: 14,
    color: '#333',
  },
  bottomMargin: {
    height: 120,
  },
}); 