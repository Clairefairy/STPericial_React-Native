import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalAdicionarEvidencia from '../../components/ModalAdicionarEvidencia';
import api from '../../services/api';

export default function DetalhesCaso({ route }) {
  const { caso } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedEvidenciaId, setSelectedEvidenciaId] = useState(null);
  const [isFavorito, setIsFavorito] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evidencias, setEvidencias] = useState([]);
  const [casoDetalhado, setCasoDetalhado] = useState(null);

  useEffect(() => {
    fetchCasoDetalhado();
    fetchEvidencias();
  }, []);

  const fetchCasoDetalhado = async () => {
    try {
      const response = await api.get(`/api/cases/${caso._id}`);
      setCasoDetalhado(response.data);
    } catch (err) {
      setError("Erro ao carregar detalhes do caso");
      console.error("Erro ao buscar detalhes do caso:", err);
    }
  };

  const fetchEvidencias = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/evidences');
      const evidenciasDoCaso = response.data.filter(evidencia => evidencia.case === caso._id);
      setEvidencias(evidenciasDoCaso);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar evidências");
      console.error("Erro ao buscar evidências:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "em_andamento":
        return "#FFD700";
      case "finalizado":
        return "#87c05e";
      case "arquivado":
        return "#FFA500";
      default:
        return "#ccc";
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

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleGerarLaudo = (evidenciaId) => {
    setSelectedEvidenciaId(evidenciaId);
    setShowConfirmPopup(true);
  };

  const handleConfirmarGeracao = () => {
    setShowConfirmPopup(false);
    setShowSuccessPopup(true);
  };

  const handleFecharSuccess = () => {
    setShowSuccessPopup(false);
  };

  const toggleFavorito = () => {
    setIsFavorito(!isFavorito);
  };

  const renderEvidenciaCard = (evidencia) => {
    return (
      <View key={evidencia._id} style={styles.evidenciaCard}>
        {(evidencia.type === 'imagem' || evidencia.type === 'video') && evidencia.fileUrl && (
          <Image
            source={{ uri: evidencia.fileUrl }}
            style={styles.evidenciaPreview}
            resizeMode="cover"
          />
        )}
        <View style={styles.evidenciaInfo}>
          <Text style={styles.evidenciaId}>Evidência #{evidencia._id}</Text>
          <Text style={styles.evidenciaTipo}>Tipo: {evidencia.type || "Não especificado"}</Text>
          <Text style={styles.evidenciaDescricao}>{evidencia.text || "Sem descrição"}</Text>
          <Text style={styles.evidenciaData}>Data de coleta: {formatDate(evidencia.collectionDate)}</Text>
          <Text style={styles.evidenciaColetor}>
            Coletado por: {typeof evidencia.collectedBy === 'object' ? evidencia.collectedBy.name : evidencia.collectedBy || "Não informado"}
          </Text>
          
          <View style={styles.evidenciaActions}>
            <TouchableOpacity
              style={styles.gerarLaudoButton}
              onPress={() => handleGerarLaudo(evidencia._id)}
            >
              <Feather name="file-text" size={20} color="#357bd2" />
              <Text style={styles.gerarLaudoText}>Gerar Laudo</Text>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
                <Feather name="edit-2" size={20} color="#87c05e" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
                <Feather name="trash-2" size={20} color="#ff4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleSaveEvidencias = (novasEvidencias) => {
    // Aqui você implementará a lógica para salvar as evidências
    console.log('Salvando evidências:', novasEvidencias);
    setModalVisible(false);
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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.casoId}>Caso #{caso._id}</Text>
        <TouchableOpacity
          style={styles.favoritoButton}
          onPress={toggleFavorito}
        >
          <AntDesign 
            name={isFavorito ? "star" : "staro"} 
            size={24} 
            color={isFavorito ? "#FFD700" : "#666"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tipoContainer}>
        <Text style={styles.tipo}>{caso.type || "Não especificado"}</Text>
      </View>

      <Text style={styles.titulo}>{caso.title || "Sem título"}</Text>

      <View style={[styles.statusContainer, { backgroundColor: getStatusColor(caso.status) }]}>
        {getStatusIcon(caso.status)}
        <Text style={styles.status}>{formatStatus(caso.status)}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.descricao}>{caso.description || "Sem descrição"}</Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Abertura</Text>
          <Text style={styles.infoValue}>{formatDate(caso.openingDate)}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Fechamento</Text>
          <Text style={styles.infoValue}>{formatDate(caso.closingDate)}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Responsável</Text>
          <Text style={styles.infoValue}>
            {typeof caso.responsible === 'object' ? caso.responsible.name : caso.responsible || "Não atribuído"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Vítima</Text>
          <Text style={styles.infoValue}>
            {typeof caso.victim === 'object' ? caso.victim.name : caso.victim || "Sem vítima"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Criação</Text>
          <Text style={styles.infoValue}>{formatDate(caso.createdAt)}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Última Atualização</Text>
          <Text style={styles.infoValue}>{formatDate(caso.updatedAt)}</Text>
        </View>
      </View>

      <View style={styles.evidenciasSection}>
        <View style={styles.evidenciasHeader}>
          <Text style={styles.sectionTitle}>Evidências</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Feather name="file-plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar evidência</Text>
          </TouchableOpacity>
        </View>
        {evidencias.length > 0 ? (
          evidencias.map(renderEvidenciaCard)
        ) : (
          <Text style={styles.noEvidencias}>Nenhuma evidência registrada</Text>
        )}
      </View>

      <ModalAdicionarEvidencia
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEvidencias}
      />

      {/* Popup de Confirmação */}
      <Modal
        visible={showConfirmPopup}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Confirma geração de laudo para Evidência {selectedEvidenciaId}?
            </Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowConfirmPopup(false)}
              >
                <Text style={styles.popupButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupButton, styles.confirmButton]}
                onPress={handleConfirmarGeracao}
              >
                <Text style={styles.popupButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Popup de Sucesso */}
      <Modal
        visible={showSuccessPopup}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Laudo gerado com sucesso!
            </Text>
            <TouchableOpacity
              style={[styles.popupButton, styles.confirmButton]}
              onPress={handleFecharSuccess}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  casoId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tipoContainer: {
    backgroundColor: '#357bd2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tipo: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  status: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#333',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  descricao: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 15,
    paddingRight: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  evidenciasSection: {
    marginTop: 20,
  },
  evidenciasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  evidenciaCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  evidenciaPreview: {
    width: '100%',
    height: 200,
  },
  evidenciaInfo: {
    padding: 15,
  },
  evidenciaId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  evidenciaTipo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  evidenciaDescricao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  evidenciaData: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  evidenciaColetor: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#87c05e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  evidenciaActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  gerarLaudoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#357bd2',
    borderRadius: 8,
    padding: 8,
    gap: 8,
  },
  gerarLaudoText: {
    color: '#357bd2',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#87c05e',
  },
  deleteButton: {
    borderColor: '#ff4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  popupText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  popupButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  popupButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  confirmButton: {
    backgroundColor: '#87c05e',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  popupButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  favoritoButton: {
    padding: 8,
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
  noEvidencias: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
}); 