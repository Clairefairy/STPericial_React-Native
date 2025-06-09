import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ModalEditarRegistroOdontologico({
  visible,
  onClose,
  onSave,
  registro,
  loading,
}) {
  const [dentesAusentes, setDentesAusentes] = useState([]);
  const [novoDente, setNovoDente] = useState("");
  const [marcasOdontologicas, setMarcasOdontologicas] = useState([]);
  const [novaMarca, setNovaMarca] = useState("");
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    if (registro) {
      setDentesAusentes(registro.missingTeeth || []);
      setMarcasOdontologicas(registro.dentalMarks || []);
      setObservacoes(registro.notes || "");
    }
  }, [registro]);

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

  const handleAddMarca = () => {
    if (novaMarca.trim()) {
      setMarcasOdontologicas([...marcasOdontologicas, novaMarca.trim()]);
      setNovaMarca("");
    }
  };

  const handleRemoveMarca = (index) => {
    const newMarcas = [...marcasOdontologicas];
    newMarcas.splice(index, 1);
    setMarcasOdontologicas(newMarcas);
  };

  const handleSave = () => {
    const dadosAtualizados = {
      missingTeeth: dentesAusentes,
      dentalMarks: marcasOdontologicas,
      notes: observacoes,
    };
    onSave(dadosAtualizados);
  };

  const renderFormItem = () => (
    <View>
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
        <View style={styles.dentesInputContainer}>
          <TextInput
            style={styles.dentesInput}
            value={novaMarca}
            onChangeText={setNovaMarca}
            placeholder="Digite uma marca odontológica"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddMarca}
          >
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.dentesList}>
          {marcasOdontologicas.map((marca, index) => (
            <View key={index} style={styles.denteItem}>
              <Text style={styles.denteText}>{marca}</Text>
              <TouchableOpacity
                onPress={() => handleRemoveMarca(index)}
                style={styles.removeButton}
              >
                <Icon name="close" size={20} color="#ff0000" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Editar Registro Odontológico</Text>

          <FlatList
            data={[1]}
            renderItem={renderFormItem}
            keyExtractor={() => 'form'}
            keyboardShouldPersistTaps="handled"
            style={styles.formList}
          />

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name="save" size={20} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Salvar</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={loading}
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
  formList: {
    maxHeight: "60%",
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
  saveButton: {
    backgroundColor: '#357bd2',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 