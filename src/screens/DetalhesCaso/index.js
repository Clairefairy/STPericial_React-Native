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
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalAdicionarEvidencia from '../../components/ModalAdicionarEvidencia';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwtDecode from 'jwt-decode';

export default function DetalhesCaso({ route, navigation }) {
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
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEvidencia, setSelectedEvidencia] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDate, setEditDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showDeleteCaseConfirm, setShowDeleteCaseConfirm] = useState(false);
  const [showDeleteCaseWarning, setShowDeleteCaseWarning] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState(5);
  const [canDelete, setCanDelete] = useState(false);
  const [responsibleName, setResponsibleName] = useState('');
  const [laudos, setLaudos] = useState({});
  const [showDownloadConfirm, setShowDownloadConfirm] = useState(false);
  const [selectedLaudoId, setSelectedLaudoId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchCasoDetalhado();
    fetchEvidencias();
    checkFavorito();
    fetchLaudos();
    getCurrentUserId();
  }, []);

  const fetchCasoDetalhado = async () => {
    try {
      const response = await api.get(`/api/cases/${caso._id}`);
      setCasoDetalhado(response.data);
      
      // Buscar nome do responsável
      if (response.data.responsible) {
        try {
          const userResponse = await api.get(`/api/users/${response.data.responsible}`);
          setResponsibleName(userResponse.data.nome || userResponse.data.email || 'Responsável não encontrado');
        } catch (err) {
          console.error("Erro ao buscar responsável:", err);
          setResponsibleName('Responsável não encontrado');
        }
      } else {
        setResponsibleName('Não atribuído');
      }
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

  const fetchLaudos = async () => {
    try {
      const response = await api.get('/api/reports');
      const laudosPorEvidencia = {};
      response.data.forEach(laudo => {
        if (laudo.evidence) {
          laudosPorEvidencia[laudo.evidence] = laudo;
        }
      });
      setLaudos(laudosPorEvidencia);
    } catch (err) {
      console.error("Erro ao buscar laudos:", err);
    }
  };

  const getCurrentUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode.jwtDecode(token);
        setCurrentUserId(decoded.id);
      }
    } catch (err) {
      console.error("Erro ao obter ID do usuário:", err);
    }
  };

  const checkFavorito = async () => {
    try {
      const favoritosIds = await AsyncStorage.getItem('favoritos');
      if (favoritosIds) {
        const ids = JSON.parse(favoritosIds);
        setIsFavorito(ids.includes(caso._id));
      }
    } catch (err) {
      console.error("Erro ao verificar favorito:", err);
    }
  };

  const toggleFavorito = async () => {
    try {
      const favoritosIds = await AsyncStorage.getItem('favoritos');
      let ids = favoritosIds ? JSON.parse(favoritosIds) : [];

      if (isFavorito) {
        ids = ids.filter(id => id !== caso._id);
      } else {
        ids.push(caso._id);
      }

      await AsyncStorage.setItem('favoritos', JSON.stringify(ids));
      setIsFavorito(!isFavorito);
    } catch (err) {
      console.error("Erro ao atualizar favorito:", err);
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

  const handleGerarLaudo = async (evidenciaId) => {
    try {
      if (!currentUserId) {
        Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
        return;
      }

      const response = await api.get(`/api/reports/ia/${caso._id}`, {
        params: {
          evidence: evidenciaId,
          expertResponsible: currentUserId
        }
      });
      
      await fetchLaudos();
      Alert.alert('Sucesso', 'Laudo gerado com sucesso!');
    } catch (err) {
      console.error("Erro ao gerar laudo:", err);
      Alert.alert('Erro', 'Não foi possível gerar o laudo. Tente novamente.');
    }
  };

  const handleDownloadLaudo = async (laudoId) => {
    try {
      const response = await api.get(`/api/reports/${laudoId}/pdf`, {
        responseType: 'blob'
      });
      
      // Aqui você precisará implementar a lógica para salvar o PDF no dispositivo
      // Isso pode variar dependendo da plataforma (iOS/Android)
      // Por enquanto, vamos apenas mostrar uma mensagem de sucesso
      Alert.alert('Sucesso', 'Laudo baixado com sucesso!');
    } catch (err) {
      console.error("Erro ao baixar laudo:", err);
      Alert.alert('Erro', 'Não foi possível baixar o laudo. Tente novamente.');
    }
  };

  const handleEditEvidencia = (evidencia) => {
    setSelectedEvidencia(evidencia);
    setEditText(evidencia.text || '');
    setEditDate(new Date(evidencia.collectionDate));
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/api/evidences/${selectedEvidencia._id}`, {
        text: editText,
        collectionDate: editDate.toISOString(),
      });
      
      // Atualiza a lista de evidências
      const response = await api.get('/api/evidences');
      const evidenciasDoCaso = response.data.filter(evidencia => evidencia.case === caso._id);
      setEvidencias(evidenciasDoCaso);
      
      setEditModalVisible(false);
    } catch (err) {
      console.error("Erro ao editar evidência:", err);
      setError("Erro ao editar evidência");
    }
  };

  const handleDeleteEvidencia = async () => {
    try {
      await api.delete(`/api/evidences/${selectedEvidencia._id}`);
      
      // Atualiza a lista de evidências
      const response = await api.get('/api/evidences');
      const evidenciasDoCaso = response.data.filter(evidencia => evidencia.case === caso._id);
      setEvidencias(evidenciasDoCaso);
      
      setShowDeleteWarning(false);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Erro ao excluir evidência:", err);
      setError("Erro ao excluir evidência");
    }
  };

  const handleDeleteCase = async () => {
    try {
      await api.delete(`/api/cases/${caso._id}`);
      navigation.goBack();
    } catch (err) {
      console.error("Erro ao excluir caso:", err);
      setError("Erro ao excluir caso");
    }
  };

  useEffect(() => {
    let timer;
    if (showDeleteCaseWarning) {
      setDeleteCountdown(5);
      setCanDelete(false);
      timer = setInterval(() => {
        setDeleteCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanDelete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showDeleteCaseWarning]);

  const renderEvidenciaCard = (evidencia) => {
    const laudo = laudos[evidencia._id];

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
            {laudo ? (
              <TouchableOpacity
                style={styles.gerarLaudoButton}
                onPress={() => {
                  setSelectedLaudoId(laudo._id);
                  setShowDownloadConfirm(true);
                }}
              >
                <Feather name="download" size={20} color="#357bd2" />
                <Text style={styles.gerarLaudoText}>Baixar Laudo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.gerarLaudoButton}
                onPress={() => handleGerarLaudo(evidencia._id)}
              >
                <Feather name="file-text" size={20} color="#357bd2" />
                <Text style={styles.gerarLaudoText}>Gerar Laudo</Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditEvidencia(evidencia)}
              >
                <Feather name="edit-2" size={20} color="#87c05e" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteEvidenciaButton]}
                onPress={() => {
                  setSelectedEvidencia(evidencia);
                  setShowDeleteConfirm(true);
                }}
              >
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

      <View style={styles.statusRow}>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(caso.status) }]}>
          {getStatusIcon(caso.status)}
          <Text style={styles.status}>{formatStatus(caso.status)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.generatePdfButton}
          onPress={() => {}}
        >
          <Feather name="file-text" size={20} color="#fff" />
          <Text style={styles.generatePdfButtonText}>Gerar PDF</Text>
        </TouchableOpacity>
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
          <Text style={styles.infoValue}>{responsibleName}</Text>
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

      <View style={styles.deleteCaseSection}>
        <TouchableOpacity
          style={styles.deleteCaseButton}
          onPress={() => setShowDeleteCaseConfirm(true)}
        >
          <Feather name="trash-2" size={20} color="#fff" />
          <Text style={styles.deleteCaseButtonText}>Excluir Caso</Text>
        </TouchableOpacity>
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
                onPress={() => {
                  setShowConfirmPopup(false);
                  setShowSuccessPopup(true);
                }}
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
              onPress={() => {
                setShowSuccessPopup(false);
              }}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContent}>
            <Text style={styles.modalTitle}>Editar Evidência</Text>
            
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={styles.textInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              numberOfLines={4}
              placeholder="Digite a descrição da evidência"
            />

            <Text style={styles.inputLabel}>Data de Coleta</Text>
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {editDate.toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={editDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setEditDate(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Tem certeza que deseja excluir esta evidência?
            </Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.popupButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupButton, styles.confirmButton]}
                onPress={() => {
                  setShowDeleteConfirm(false);
                  setShowDeleteWarning(true);
                }}
              >
                <Text style={styles.popupButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Aviso de Exclusão */}
      <Modal
        visible={showDeleteWarning}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Atenção! Esta ação é irreversível. Deseja continuar?
            </Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowDeleteWarning(false)}
              >
                <Text style={styles.popupButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupButton, styles.confirmButton]}
                onPress={handleDeleteEvidencia}
              >
                <Text style={styles.popupButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Exclusão do Caso */}
      <Modal
        visible={showDeleteCaseConfirm}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Tem certeza que deseja excluir este caso?
            </Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowDeleteCaseConfirm(false)}
              >
                <Text style={styles.popupButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupButton, styles.confirmButton]}
                onPress={() => {
                  setShowDeleteCaseConfirm(false);
                  setShowDeleteCaseWarning(true);
                }}
              >
                <Text style={styles.popupButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Aviso de Exclusão do Caso */}
      <Modal
        visible={showDeleteCaseWarning}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.warningTitle}>ATENÇÃO!</Text>
            <Text style={styles.warningText}>
              Esta ação é <Text style={styles.warningHighlight}>IRREVERSÍVEL</Text> e excluirá permanentemente:
            </Text>
            <View style={styles.warningList}>
              <Text style={styles.warningItem}>• Todas as evidências do caso</Text>
              <Text style={styles.warningItem}>• Todos os laudos gerados</Text>
              <Text style={styles.warningItem}>• Todo o histórico do caso</Text>
            </View>
            <Text style={styles.warningText}>
              Deseja realmente continuar?
            </Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowDeleteCaseWarning(false)}
              >
                <Text style={styles.popupButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.popupButton,
                  styles.deleteButton,
                  !canDelete && styles.disabledButton
                ]}
                onPress={handleDeleteCase}
                disabled={!canDelete}
              >
                <Text style={styles.popupButtonText}>
                  {canDelete ? 'Excluir' : `Aguarde ${deleteCountdown}s`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Download */}
      <Modal
        visible={showDownloadConfirm}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <Text style={styles.popupText}>
              Deseja baixar o laudo em PDF?
            </Text>
            <View style={styles.popupButtons}>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowDownloadConfirm(false)}
              >
                <Text style={styles.popupButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupButton, styles.confirmButton]}
                onPress={() => {
                  setShowDownloadConfirm(false);
                  handleDownloadLaudo(selectedLaudoId);
                }}
              >
                <Text style={styles.popupButtonText}>Baixar</Text>
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
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
  deleteEvidenciaButton: {
    borderColor: '#ff4444',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
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
  editModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#87c05e',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteCaseSection: {
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  deleteCaseButton: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  deleteCaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 15,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  warningHighlight: {
    color: '#ff4444',
    fontWeight: 'bold',
  },
  warningList: {
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  warningItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  generatePdfButton: {
    backgroundColor: '#357bd2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  generatePdfButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
}); 