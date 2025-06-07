import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ModalRegistroOdontologico({
  visible,
  onClose,
  onSave,
}) {
  const [dentesAusentes, setDentesAusentes] = useState([]);
  const [novoDente, setNovoDente] = useState("");
  const [marcasOdontologicas, setMarcasOdontologicas] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [vitima, setVitima] = useState("");

  const handleAddDente = () => {
    if (novoDente && novoDente.length === 2 && !isNaN(novoDente)) {
      setDentesAusentes([...dentesAusentes, novoDente]);
      setNovoDente("");
    }
  };

  const handleRemoveDente = (index) => {
    const newDentes = [...dentesAusentes];
    newDentes.splice(index, 1);
    setDentesAusentes(newDentes);
  };

  const handleSave = () => {
    const registro = {
      dentesAusentes,
      marcasOdontologicas,
      observacoes,
      vitima,
    };
    onSave(registro);
    onClose();
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
          <Text style={styles.modalTitle}>Adicionar Registro Odontológico</Text>

          <ScrollView style={styles.scrollView}>
            {/* Dentes Ausentes */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dentes Ausentes</Text>
              <View style={styles.dentesInputContainer}>
                <TextInput
                  style={styles.dentesInput}
                  value={novoDente}
                  onChangeText={setNovoDente}
                  placeholder="Digite o número do dente (2 dígitos)"
                  keyboardType="numeric"
                  maxLength={2}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddDente}
                >
                  <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.dentesList}>
                {dentesAusentes.map((dente, index) => (
                  <View key={index} style={styles.denteItem}>
                    <Text style={styles.denteText}>{dente}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveDente(index)}
                      style={styles.removeButton}
                    >
                      <Icon name="close" size={20} color="#ff0000" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {/* Marcas Odontológicas */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Marcas Odontológicas</Text>
              <TextInput
                style={styles.input}
                value={marcasOdontologicas}
                onChangeText={setMarcasOdontologicas}
                placeholder="Digite as marcas odontológicas"
              />
            </View>

            {/* Observações */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={observacoes}
                onChangeText={setObservacoes}
                placeholder="Digite as observações"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Vítima */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vítima</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={vitima}
                  onValueChange={(itemValue) => setVitima(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecione uma vítima" value="" />
                  <Picker.Item label="João Silva" value="João Silva" />
                  <Picker.Item label="Maria Santos" value="Maria Santos" />
                  <Picker.Item label="Pedro Oliveira" value="Pedro Oliveira" />
                </Picker>
              </View>
            </View>
          </ScrollView>

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Criar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
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
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  dentesInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dentesInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#357bd2",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dentesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  denteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  denteText: {
    marginRight: 5,
    fontSize: 16,
  },
  removeButton: {
    padding: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  createButton: {
    backgroundColor: "#87c05e",
  },
  cancelButton: {
    backgroundColor: "#ff0000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 