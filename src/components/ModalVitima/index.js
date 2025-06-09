import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from '@react-native-picker/picker';

export default function ModalVitima({ visible, onClose, onSave }) {
  const [nomeVitima, setNomeVitima] = useState('');
  const [sexoVitima, setSexoVitima] = useState('');
  const [etniaVitima, setEtniaVitima] = useState('');
  const [identificadoVitima, setIdentificadoVitima] = useState('');
  const [identificacaoVitima, setIdentificacaoVitima] = useState('');
  const [observacoesVitima, setObservacoesVitima] = useState('');

  const handleCriarVitima = () => {
    const vitimaData = {
      nome: nomeVitima,
      sexo: sexoVitima,
      etnia: etniaVitima,
      identificado: identificadoVitima,
      identificacao: identificacaoVitima,
      observacoes: observacoesVitima
    };
    
    onSave(vitimaData);
    
    // Limpar os campos após criar
    setNomeVitima('');
    setSexoVitima('');
    setEtniaVitima('');
    setIdentificadoVitima('');
    setIdentificacaoVitima('');
    setObservacoesVitima('');
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
          <Text style={styles.modalTitle}>Criar Nova Vítima</Text>
          
          <ScrollView style={styles.modalScroll}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da vítima..."
              value={nomeVitima}
              onChangeText={setNomeVitima}
            />

            <Text style={styles.label}>Sexo</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={sexoVitima}
                onValueChange={(itemValue) => setSexoVitima(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione o sexo..." value="" />
                <Picker.Item label="Masculino" value="Masculino" />
                <Picker.Item label="Feminino" value="Feminino" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </View>

            <Text style={styles.label}>Etnia</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={etniaVitima}
                onValueChange={(itemValue) => setEtniaVitima(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione a etnia..." value="" />
                <Picker.Item label="Branca" value="Branca" />
                <Picker.Item label="Preta" value="Preta" />
                <Picker.Item label="Parda" value="Parda" />
                <Picker.Item label="Amarela" value="Amarela" />
                <Picker.Item label="Indígena" value="Indígena" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </View>

            <Text style={styles.label}>Identificado</Text>
            <View style={styles.inputContainer}>
              <Picker
                selectedValue={identificadoVitima}
                onValueChange={(itemValue) => setIdentificadoVitima(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione..." value="" />
                <Picker.Item label="Sim" value="Sim" />
                <Picker.Item label="Não" value="Não" />
              </Picker>
            </View>

            <Text style={styles.label}>Identificação</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a identificação..."
              keyboardType="numeric"
              value={identificacaoVitima}
              onChangeText={setIdentificacaoVitima}
            />

            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Digite as observações..."
              multiline={true}
              numberOfLines={4}
              value={observacoesVitima}
              onChangeText={setObservacoesVitima}
            />

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCriarVitima}
              >
                <Text style={styles.buttonText}>Criar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
  modalScroll: {
    maxHeight: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: "#333",
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 50,
  },
  picker: {
    flex: 1,
    height: 50,
    width: '100%',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    minWidth: 120,
  },
  cancelButton: {
    backgroundColor: "#ff0000",
  },
  createButton: {
    backgroundColor: "#87c05e",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
}); 