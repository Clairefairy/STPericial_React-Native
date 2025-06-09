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
import { useFocusEffect } from '@react-navigation/native';
import ModalRegistroOdontologico from "../../components/ModalRegistroOdontologico";
import api from "../../services/api";
import ModalDetalhesRegistroOdontologico from "../../components/ModalDetalhesRegistroOdontologico";

export default function RegistrosOdontologicos() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchRegistros();
    }, [])
  );

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/dentalRecord');
      const registrosData = response.data;

      // Buscar detalhes das vítimas
      const registrosComVitimas = await Promise.all(
        registrosData.map(async (registro) => {
          if (registro.victim) {
            try {
              const victimResponse = await api.get(`/api/victims/${registro.victim}`);
              return { ...registro, victim: victimResponse.data };
            } catch (err) {
              console.error('Erro ao buscar detalhes da vítima:', err);
              return registro;
            }
          }
          return registro;
        })
      );

      setRegistros(registrosComVitimas);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar registros:', err);
      setError('Erro ao carregar registros odontológicos');
    } finally {
      setLoading(false);
    }
  };

  const handleDetalhes = async (registro) => {
    try {
      setLoadingDetails(true);
      const response = await api.get(`/api/dentalRecord/${registro._id}`);
      const registroData = response.data;
      
      // Buscar detalhes da vítima
      if (registroData.victim) {
        try {
          const victimResponse = await api.get(`/api/victims/${registroData.victim}`);
          registroData.victim = victimResponse.data;
        } catch (err) {
          console.error('Erro ao buscar detalhes da vítima:', err);
        }
      }
      
      setSelectedRegistro(registroData);
      setModalVisible(true);
    } catch (err) {
      console.error('Erro ao buscar detalhes do registro:', err);
      setError('Erro ao carregar detalhes do registro');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleExcluir = async () => {
    try {
      setLoadingDelete(true);
      await api.delete(`/api/dentalRecord/${selectedRegistro._id}`);
      setConfirmModalVisible(false);
      setModalVisible(false);
      fetchRegistros(); // Atualiza a lista após excluir
    } catch (err) {
      console.error('Erro ao excluir registro:', err);
      setError('Erro ao excluir registro');
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleExcluirClick = () => {
    setConfirmModalVisible(true);
  };

  const handleCreateRegistro = async (registro) => {
    try {
      setLoadingCreate(true);
      await api.post('/api/dentalRecord', registro);
      setModalCreateVisible(false);
      fetchRegistros(); // Atualiza a lista após criar
    } catch (err) {
      console.error('Erro ao criar registro:', err);
      setError('Erro ao criar registro odontológico');
    } finally {
      setLoadingCreate(false);
    }
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
      <Text style={styles.title}>Registros Odontológicos</Text>

      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setModalCreateVisible(true)}
      >
        <Icon name="add" size={24} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.createButtonText}>Criar Registro</Text>
      </TouchableOpacity>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.vitimaCell]}>Vítima</Text>
          <Text style={[styles.headerCell, styles.notasCell]}>Notas</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {registros.map((registro) => (
          <View key={registro._id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.vitimaCell]}>
              {registro.victim?.name || 'null'}
            </Text>
            <Text style={[styles.cell, styles.notasCell]}>
              {registro.notes || 'Sem notas'}
            </Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDetalhes(registro)}
                disabled={loadingDetails}
              >
                {loadingDetails && selectedRegistro?._id === registro._id ? (
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
      <ModalDetalhesRegistroOdontologico
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        registro={selectedRegistro}
        onUpdate={fetchRegistros}
      />

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
              Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.
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

      {/* Modal de Criação */}
      <ModalRegistroOdontologico
        visible={modalCreateVisible}
        onClose={() => setModalCreateVisible(false)}
        onSave={handleCreateRegistro}
        loading={loadingCreate}
      />
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
  vitimaCell: {
    flex: 1.5,
  },
  notasCell: {
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
  bottomMargin: {
    height: 120,
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
    paddingBottom: 80,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalScrollView: {
    maxHeight: '60%',
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
    marginBottom: 15,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#357bd2',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff4444',
  },
  closeButton: {
    backgroundColor: '#357bd2',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 16,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: "#357bd2",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 