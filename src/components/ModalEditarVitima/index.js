import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../../services/api';

const SEXO_OPTIONS = [
  { label: 'Feminino', value: 'feminino' },
  { label: 'Masculino', value: 'masculino' },
  { label: 'Outro', value: 'outro' },
];

const ETNIA_OPTIONS = [
  { label: 'Branca', value: 'branca' },
  { label: 'Parda', value: 'parda' },
  { label: 'Preta', value: 'preta' },
  { label: 'Indígena', value: 'indigena' },
  { label: 'Amarela', value: 'amarela' },
  { label: 'Outro', value: 'outro' },
];

export default function ModalEditarVitima({ visible, onClose, vitima, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    sex: '',
    ethnicity: '',
    dateBirth: '',
    age: '',
    identified: false,
    identification: '',
    observations: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (vitima) {
      setFormData({
        name: vitima.name || '',
        sex: vitima.sex || '',
        ethnicity: vitima.ethnicity || '',
        dateBirth: vitima.dateBirth || '',
        age: vitima.age?.toString() || '',
        identified: vitima.identified || false,
        identification: vitima.identification || '',
        observations: vitima.observations || '',
      });

      if (vitima.dateBirth) {
        setSelectedDate(new Date(vitima.dateBirth));
      }
    }
  }, [vitima]);

  const handleSave = async () => {
    try {
      const dataToSend = {
        ...formData,
        age: parseInt(formData.age) || 0,
      };

      await api.put(`/api/victims/${vitima._id}`, dataToSend);
      onSave();
      onClose();
      Alert.alert('Sucesso', 'Vítima atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar vítima:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a vítima. Tente novamente.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, dateBirth: formattedDate });
    }
  };

  const formatDateInput = (text) => {
    // Remove todos os caracteres não numéricos
    const numbers = text.replace(/\D/g, '');
    
    // Formata a data conforme o usuário digita
    let formatted = numbers;
    if (numbers.length > 2) {
      formatted = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }
    if (numbers.length > 4) {
      formatted = `${formatted.slice(0, 5)}/${formatted.slice(5, 9)}`;
    }

    // Atualiza o estado com a data formatada
    setFormData({ ...formData, dateBirth: formatted });

    // Se tiver 8 dígitos, converte para o formato da API
    if (numbers.length === 8) {
      const [day, month, year] = formatted.split('/');
      const date = new Date(year, month - 1, day);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        setFormData({ ...formData, dateBirth: date.toISOString().split('T')[0] });
      }
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Vítima</Text>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Nome da vítima"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.sex}
                  onValueChange={(value) => setFormData({ ...formData, sex: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione o sexo" value="" />
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Etnia</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={formData.ethnicity}
                  onValueChange={(value) => setFormData({ ...formData, ethnicity: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione a etnia" value="" />
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <View style={styles.dateInputContainer}>
                <TextInput
                  style={[styles.input, styles.dateInput]}
                  value={formData.dateBirth}
                  onChangeText={formatDateInput}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                />
                <TouchableOpacity
                  style={styles.calendarButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Icon name="calendar-today" size={24} color="#357bd2" />
                </TouchableOpacity>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idade</Text>
              <TextInput
                style={styles.input}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                placeholder="Idade da vítima"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Identificação</Text>
              <View style={styles.identificacaoContainer}>
                <TouchableOpacity
                  style={[
                    styles.identificacaoButton,
                    formData.identified && styles.identificacaoButtonSelected,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, identified: !formData.identified })
                  }
                >
                  <Text
                    style={[
                      styles.identificacaoButtonText,
                      formData.identified && styles.identificacaoButtonTextSelected,
                    ]}
                  >
                    {formData.identified ? 'Identificada' : 'Não Identificada'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {formData.identified && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Número de Identificação</Text>
                <TextInput
                  style={styles.input}
                  value={formData.identification}
                  onChangeText={(text) =>
                    setFormData({ ...formData, identification: text })
                  }
                  placeholder="Número de identificação"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.observations}
                onChangeText={(text) => setFormData({ ...formData, observations: text })}
                placeholder="Observações adicionais"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  formContainer: {
    maxHeight: '100%',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#357bd2',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
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
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
    marginRight: 10,
  },
  calendarButton: {
    padding: 10,
  },
  identificacaoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  identificacaoButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#357bd2',
    minWidth: 150,
    alignItems: 'center',
  },
  identificacaoButtonSelected: {
    backgroundColor: '#357bd2',
  },
  identificacaoButtonText: {
    color: '#357bd2',
    fontSize: 16,
  },
  identificacaoButtonTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  saveButton: {
    backgroundColor: '#357bd2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 