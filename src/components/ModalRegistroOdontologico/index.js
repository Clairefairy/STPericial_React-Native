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
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../../services/api";

export default function ModalRegistroOdontologico({
  visible,
  onClose,
  onSave,
  loading,
}) {
  const [dentesAusentes, setDentesAusentes] = useState([]);
  const [novoDente, setNovoDente] = useState("");
  const [marcasOdontologicas, setMarcasOdontologicas] = useState([]);
  const [novaMarca, setNovaMarca] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [vitima, setVitima] = useState(null);
  const [searchVictim, setSearchVictim] = useState("");
  const [filteredVictims, setFilteredVictims] = useState([]);
  const [showVictimSuggestions, setShowVictimSuggestions] = useState(false);
  const [loadingVictims, setLoadingVictims] = useState(false);
  const [victims, setVictims] = useState([]);

  useEffect(() => {
    fetchVictims();
  }, []);

  const fetchVictims = async () => {
    try {
      setLoadingVictims(true);
      const response = await api.get('/api/victims');
      setVictims(response.data);
    } catch (err) {
      console.error('Erro ao buscar vítimas:', err);
    } finally {
      setLoadingVictims(false);
    }
  };

  const handleVictimSearch = (text) => {
    setSearchVictim(text);
    if (text.length > 0) {
      const filtered = victims.filter(victim => 
        victim.name?.toLowerCase().includes(text.toLowerCase()) ||
        victim._id?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredVictims(filtered);
      setShowVictimSuggestions(true);
    } else {
      setFilteredVictims([]);
      setShowVictimSuggestions(false);
    }
  };

  const handleVictimSelect = (selectedVictim) => {
    setVitima(selectedVictim);
    setSearchVictim(selectedVictim.name || 'Vítima sem nome');
    setShowVictimSuggestions(false);
  };

  const handleClearVictim = () => {
    setVitima(null);
    setSearchVictim("");
  };

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
    if (!vitima) {
      alert('Por favor, selecione uma vítima');
      return;
    }

    const registro = {
      missingTeeth: dentesAusentes,
      dentalMarks: marcasOdontologicas,
      notes: observacoes,
      victim: vitima._id,
    };
    onSave(registro);
  };

  const renderVictimItem = ({ item }) => (
    <TouchableOpacity
      style={styles.victimItem}
      onPress={() => handleVictimSelect(item)}
    >
      <Text style={styles.victimName}>{item.name || 'Vítima sem nome'}</Text>
      <Text style={styles.victimId}>ID: {item._id}</Text>
    </TouchableOpacity>
  );

  const renderFormItem = () => (
    <View>
      {/* Vítima */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vítima</Text>
        <View style={styles.victimSearchContainer}>
          <TextInput
            style={[styles.input, vitima && styles.inputDisabled]}
            value={searchVictim}
            onChangeText={handleVictimSearch}
            placeholder="Buscar vítima por nome ou ID"
            editable={!vitima}
          />
          {vitima && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearVictim}
            >
              <Icon name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {showVictimSuggestions && !vitima && (
          <View style={styles.suggestionsContainer}>
            {loadingVictims ? (
              <ActivityIndicator size="small" color="#357bd2" />
            ) : (
              <FlatList
                data={filteredVictims}
                renderItem={renderVictimItem}
                keyExtractor={item => item._id}
                nestedScrollEnabled={true}
                style={styles.suggestionsList}
              />
            )}
          </View>
        )}
      </View>

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
          <Text style={styles.modalTitle}>Adicionar Registro Odontológico</Text>

          <FlatList
            data={[1]} // Array com um único item para renderizar o formulário
            renderItem={renderFormItem}
            keyExtractor={() => 'form'}
            keyboardShouldPersistTaps="handled"
            style={styles.formList}
          />

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.createButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Criar</Text>
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
  victimSearchContainer: {
    position: 'relative',
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    padding: 5,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  victimItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  victimName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  victimId: {
    fontSize: 12,
    color: '#666',
  },
  formList: {
    maxHeight: '60%',
  },
}); 