import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as jwtDecode from 'jwt-decode';
import * as Location from 'expo-location';
import api from '../../services/api';

export default function ModalAdicionarEvidencia({ visible, onClose, onSave, casoId }) {
  const [evidencias, setEvidencias] = useState([
    {
      id: 1,
      type: 'Imagem',
      text: '',
      collectionDate: new Date(),
      fileUrl: null,
      fileName: null,
      location: null,
      address: null,
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEvidenciaIndex, setSelectedEvidenciaIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    getCurrentUserId();
  }, []);

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

  const handleAddEvidencia = () => {
    setEvidencias([
      ...evidencias,
      {
        id: evidencias.length + 1,
        type: 'Imagem',
        text: '',
        collectionDate: new Date(),
        fileUrl: null,
        fileName: null,
        location: null,
        address: null,
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
      novasEvidencias[index].collectionDate = selectedDate;
      setEvidencias(novasEvidencias);
    }
  };

  const handleTipoChange = (value, index) => {
    const novasEvidencias = [...evidencias];
    novasEvidencias[index].type = value;
    setEvidencias(novasEvidencias);
  };

  const handleDescricaoChange = (value, index) => {
    const novasEvidencias = [...evidencias];
    novasEvidencias[index].text = value;
    setEvidencias(novasEvidencias);
  };

  const handleCamera = async (index) => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erro', 'Precisamos de permissão para acessar a câmera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const novasEvidencias = [...evidencias];
        novasEvidencias[index].fileUrl = result.assets[0].uri;
        novasEvidencias[index].fileName = `foto_${Date.now()}.jpg`;
        setEvidencias(novasEvidencias);
      }
    } catch (err) {
      console.error('Erro ao capturar imagem:', err);
      Alert.alert('Erro', 'Não foi possível capturar a imagem');
    }
  };

  const handleFileSelect = async (index) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false
      });

      console.log('Resultado do DocumentPicker:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const novasEvidencias = [...evidencias];
        novasEvidencias[index].fileUrl = file.uri;
        novasEvidencias[index].fileName = file.name;
        setEvidencias(novasEvidencias);
        
        console.log('Nova evidência:', novasEvidencias[index]);
      }
    } catch (err) {
      console.error('Erro ao selecionar arquivo:', err);
      Alert.alert('Erro', 'Não foi possível selecionar o arquivo');
    }
  };

  const handleClearFile = (index) => {
    const novasEvidencias = [...evidencias];
    novasEvidencias[index].fileUrl = null;
    novasEvidencias[index].fileName = null;
    setEvidencias(novasEvidencias);
  };

  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'pt-BR',
            'User-Agent': 'STPericial/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }

      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return null;
    }
  };

  const handleGetLocation = async (index) => {
    try {
      setIsGettingLocation(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Erro', 'Permissão para acessar a localização foi negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const address = await getAddressFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );

      const novasEvidencias = [...evidencias];
      novasEvidencias[index].location = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      novasEvidencias[index].address = address;
      setEvidencias(novasEvidencias);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter a localização');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handleClearLocation = (index) => {
    const novasEvidencias = [...evidencias];
    novasEvidencias[index].location = null;
    novasEvidencias[index].address = null;
    setEvidencias(novasEvidencias);
  };

  const handleSave = async () => {
    if (!currentUserId) {
      Alert.alert('Erro', 'Usuário não identificado');
      return;
    }

    if (!casoId) {
      Alert.alert('Erro', 'Caso não identificado');
      return;
    }

    setLoading(true);
    try {
      const promises = evidencias.map(async (evidencia) => {
        const formData = new FormData();
        formData.append('type', evidencia.type.toLowerCase());
        formData.append('text', evidencia.text);
        formData.append('collectionDate', evidencia.collectionDate.toISOString());
        formData.append('collectedBy', currentUserId);
        formData.append('case', casoId);

        if (evidencia.location) {
          formData.append('latitude', evidencia.location.latitude.toString());
          formData.append('longitude', evidencia.location.longitude.toString());
          if (evidencia.address) {
            formData.append('address', evidencia.address);
          }
        }

        if (evidencia.fileUrl) {
          const fileUri = evidencia.fileUrl;
          const fileType = evidencia.fileName.split('.').pop();
          formData.append('file', {
            uri: fileUri,
            name: evidencia.fileName,
            type: `application/${fileType}`,
          });
        }

        return api.post('/api/evidences', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      });

      await Promise.all(promises);
      Alert.alert('Sucesso', 'Evidências salvas com sucesso!');
      onSave();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar evidências:', err);
      Alert.alert('Erro', `Não foi possível salvar as evidências.\n${err?.response?.data?.message || err.message || ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
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
                      selectedValue={evidencia.type}
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
                    value={evidencia.text}
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
                      {evidencia.collectionDate.toLocaleDateString()}
                    </Text>
                    <Icon name="calendar-today" size={20} color="#357bd2" />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Arquivo</Text>
                  {evidencia.fileName ? (
                    <View style={styles.fileInfoContainer}>
                      <Text style={styles.fileName} numberOfLines={1}>
                        {evidencia.fileName}
                      </Text>
                      <TouchableOpacity
                        style={styles.clearFileButton}
                        onPress={() => handleClearFile(index)}
                      >
                        <Feather name="x" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.fileButtonsContainer}>
                      <TouchableOpacity
                        style={[styles.fileButton, styles.cameraButton]}
                        onPress={() => handleCamera(index)}
                      >
                        <Feather name="camera" size={20} color="#357bd2" />
                        <Text style={styles.fileButtonText}>Câmera</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.fileButton, styles.fileSelectButton]}
                        onPress={() => handleFileSelect(index)}
                      >
                        <Feather name="upload" size={20} color="#357bd2" />
                        <Text style={styles.fileButtonText}>Selecionar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Localização</Text>
                  {evidencia.address ? (
                    <View style={styles.locationInfoContainer}>
                      <Text style={styles.locationText} numberOfLines={2}>
                        {evidencia.address}
                      </Text>
                      <TouchableOpacity
                        style={styles.clearLocationButton}
                        onPress={() => handleClearLocation(index)}
                      >
                        <Feather name="x" size={20} color="#ff4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[styles.locationButton, isGettingLocation && styles.locationButtonDisabled]}
                      onPress={() => handleGetLocation(index)}
                      disabled={isGettingLocation}
                    >
                      {isGettingLocation ? (
                        <>
                          <ActivityIndicator size="small" color="#357bd2" />
                          <Text style={styles.locationButtonText}>Obtendo localização...</Text>
                        </>
                      ) : (
                        <>
                          <Feather name="map-pin" size={20} color="#357bd2" />
                          <Text style={styles.locationButtonText}>Capturar Localização</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
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
                onPress={handleSave}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? 'Salvando...' : 'Salvar Tudo'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={evidencias[selectedEvidenciaIndex].collectionDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, selectedEvidenciaIndex)}
        />
      )}
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
  fileButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  fileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#f8f9fa',
  },
  fileSelectButton: {
    backgroundColor: '#f8f9fa',
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  clearFileButton: {
    padding: 4,
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
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#357bd2',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationButtonText: {
    color: '#357bd2',
    fontSize: 16,
    fontWeight: '500',
  },
  locationInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  clearLocationButton: {
    padding: 4,
  },
}); 