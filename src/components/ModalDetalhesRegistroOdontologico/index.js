import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../../services/api";
import ModalEditarRegistroOdontologico from "../ModalEditarRegistroOdontologico";

export default function ModalDetalhesRegistroOdontologico({
  visible,
  onClose,
  registro,
  onUpdate,
}) {
  const [loading, setLoading] = useState(false);
  const [victimDetails, setVictimDetails] = useState(null);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);

  useEffect(() => {
    if (registro?.victim) {
      fetchVictimDetails();
    }
  }, [registro]);

  useEffect(() => {
    console.log('Estado do modal de edição:', modalEditarVisible);
  }, [modalEditarVisible]);

  const fetchVictimDetails = async () => {
    try {
      setLoading(true);
      // Primeiro, busca o registro odontológico completo para garantir que temos o ID da vítima
      const registroResponse = await api.get(`/api/dentalRecord/${registro._id}`);
      const registroCompleto = registroResponse.data;
      
      if (registroCompleto.victim) {
        const response = await api.get(`/api/victims/${registroCompleto.victim}`);
        setVictimDetails(response.data);
      }
    } catch (err) {
      console.error('Erro ao buscar detalhes da vítima:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = () => {
    console.log('Abrindo modal de edição');
    setModalEditarVisible(true);
  };

  const handleUpdate = async (dadosAtualizados) => {
    try {
      setLoading(true);
      console.log('Atualizando registro:', dadosAtualizados);
      await api.put(`/api/dentalRecord/${registro._id}`, dadosAtualizados);
      setModalEditarVisible(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Erro ao atualizar registro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!registro) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes do Registro Odontológico</Text>

            <ScrollView style={styles.scrollView}>
              {/* Vítima */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Vítima</Text>
                {loading ? (
                  <ActivityIndicator size="small" color="#357bd2" />
                ) : victimDetails ? (
                  <View>
                    <Text style={styles.sectionContent}>
                      Nome: {victimDetails.name || 'Não informado'}
                    </Text>
                    <Text style={styles.sectionContent}>
                      ID: {victimDetails._id || 'Não informado'}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noData}>Vítima não encontrada</Text>
                )}
              </View>

              {/* Dentes Ausentes */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Dentes Ausentes</Text>
                <View style={styles.dentesList}>
                  {registro.missingTeeth && registro.missingTeeth.length > 0 ? (
                    registro.missingTeeth.map((dente, index) => (
                      <View key={index} style={styles.denteItem}>
                        <Text style={styles.denteText}>{dente}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noData}>Nenhum dente ausente registrado</Text>
                  )}
                </View>
              </View>

              {/* Marcas Odontológicas */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Marcas Odontológicas</Text>
                <View style={styles.dentesList}>
                  {registro.dentalMarks && registro.dentalMarks.length > 0 ? (
                    registro.dentalMarks.map((marca, index) => (
                      <View key={index} style={styles.denteItem}>
                        <Text style={styles.denteText}>{marca}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noData}>Nenhuma marca odontológica registrada</Text>
                  )}
                </View>
              </View>

              {/* Observações */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Observações</Text>
                <Text style={styles.sectionContent}>
                  {registro.notes || "Nenhuma observação registrada"}
                </Text>
              </View>
            </ScrollView>

            {/* Botões */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={handleEditar}
                disabled={loading}
              >
                <Icon name="edit" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Edição */}
      <ModalEditarRegistroOdontologico
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        onSave={handleUpdate}
        registro={registro}
        loading={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    position: 'relative',
    paddingBottom: 80,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  scrollView: {
    maxHeight: "80%",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#357bd2",
  },
  sectionContent: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  dentesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  denteItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  denteText: {
    fontSize: 16,
    color: "#333",
  },
  noData: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: '#357bd2',
  },
  closeButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 