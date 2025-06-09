import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';

export default function ModalAdicionarEvidencia({ visible, onClose, onSave }) {
  const [evidencias, setEvidencias] = useState([
    {
      id: 1,
      tipo: 'Imagem',
      descricao: '',
      dataColeta: new Date(),
      arquivo: null,
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEvidenciaIndex, setSelectedEvidenciaIndex] = useState(0);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [selectedEvidenciaId, setSelectedEvidenciaId] = useState(null);

  const handleAddEvidencia = () => {
    setEvidencias([
      ...evidencias,
      {
        id: evidencias.length + 1,
        tipo: 'Imagem',
        descricao: '',
        dataColeta: new Date(),
        arquivo: null,
      },
    ]);
  };

  const handleRemoveEvidencia = (index) => {
    const novasEvidencias = evidencias.filter((_, i) => i !== index);
    setEvidencias(novasEvidencias);
  };

  const handleDateChange = (event, selectedDate, index) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const novasEvidencias = [...evidencias];
      novasEvidencias[index].dataColeta = selectedDate;
      setEvidencias(novasEvidencias);
    }
  };

  const handleTipoChange = (value, index) => {
    const novasEvidencias = [...evidencias];
    novasEvidencias[index].tipo = value;
    setEvidencias(novasEvidencias);
  };

  const handleDescricaoChange = (value, index) => {
    const novasEvidencias = [...evidencias];
    novasEvidencias[index].descricao = value;
    setEvidencias(novasEvidencias);
  };

  const handleArquivoSelect = (index) => {
    // Implementar seleção de arquivo posteriormente
    console.log('Selecionar arquivo para evidência', index);
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Adicionar Evidência(s)</Text>

          <ScrollView style={styles.evidenciasContainer}>
            {evidencias.map((evidencia, index) => (
              <View key={evidencia.id} style={styles.evidenciaCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Evidência {evidencia.id}</Text>
                  {evidencias.length > 1 && index !== 0 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveEvidencia(index)}
                    >
                      <Feather name="x" size={20} color="#ff4444" />
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tipo</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={evidencia.tipo}
                      onValueChange={(value) => handleTipoChange(value, index)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Imagem" value="Imagem" />
                      <Picker.Item label="Vídeo" value="Vídeo" />
                      <Picker.Item label="Documento" value="Documento" />
                      <Picker.Item label="Texto" value="Texto" />
                    </Picker>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Descrição</Text>
                  <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={4}
                    value={evidencia.descricao}
                    onChangeText={(value) => handleDescricaoChange(value, index)}
                    placeholder="Digite a descrição da evidência..."
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Data de Coleta</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      setSelectedEvidenciaIndex(index);
                      setShowDatePicker(true);
                    }}
                  >
                    <Text style={styles.dateButtonText}>
                      {evidencia.dataColeta.toLocaleDateString()}
                    </Text>
                    <Icon name="calendar-today" size={20} color="#357bd2" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Arquivo</Text>
                  <TouchableOpacity
                    style={styles.fileButton}
                    onPress={() => handleArquivoSelect(index)}
                  >
                    <Feather name="upload" size={20} color="#357bd2" />
                    <Text style={styles.fileButtonText}>Selecionar arquivo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottomButtonsContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddEvidencia}
            >
              <Feather name="plus" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar Evidência</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => onSave(evidencias)}
              >
                <Text style={styles.buttonText}>Salvar Tudo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={evidencias[selectedEvidenciaIndex].dataColeta}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, selectedEvidenciaIndex)}
        />
      )}

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
                style={[styles.popupButton, styles.confirmButton]}
                onPress={handleConfirmarGeracao}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.popupButton, styles.cancelButton]}
                onPress={() => setShowConfirmPopup(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
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
            <Text style={styles.popupText}>Laudo gerado com sucesso!</Text>
            <TouchableOpacity
              style={[styles.popupButton, styles.confirmButton]}
              onPress={handleFecharSuccess}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    width: '90%',
    maxHeight: '95%',
    paddingBottom: 2,
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  evidenciasContainer: {
    maxHeight: '75%',
    marginBottom: 2,
  },
  evidenciaCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
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
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  fileButtonText: {
    fontSize: 16,
    color: '#357bd2',
  },
  bottomButtonsContainer: {
    marginTop: 'auto',
  },
  addButton: {
    backgroundColor: '#357bd2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#87c05e',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  evidenciaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  },
  confirmButton: {
    backgroundColor: '#87c05e',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
}); 