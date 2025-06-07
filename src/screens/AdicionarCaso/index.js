import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ModalVitima from "../../components/ModalVitima";

export default function AdicionarCaso() {
  const [tipo, setTipo] = useState('');
  const [status, setStatus] = useState('');
  const [dataAbertura, setDataAbertura] = useState(new Date());
  const [dataFechamento, setDataFechamento] = useState(null);
  const [showAberturaPicker, setShowAberturaPicker] = useState(false);
  const [showFechamentoPicker, setShowFechamentoPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeVitima, setNomeVitima] = useState('');
  const [sexoVitima, setSexoVitima] = useState('');
  const [identificadoVitima, setIdentificadoVitima] = useState('');
  const [identificacaoVitima, setIdentificacaoVitima] = useState('');
  const [observacoesVitima, setObservacoesVitima] = useState('');

  const tipos = [
    "Homicídio",
    "Lesões Corporais",
    "Violência Sexual",
    "Acidente de Trânsito com vítima",
    "Balística",
    "Outro"
  ];

  const statusOptions = [
    "Em andamento",
    "Arquivado",
    "Finalizado"
  ];

  const onAberturaChange = (event, selectedDate) => {
    setShowAberturaPicker(false);
    if (selectedDate) {
      setDataAbertura(selectedDate);
    }
  };

  const onFechamentoChange = (event, selectedDate) => {
    setShowFechamentoPicker(false);
    if (selectedDate) {
      setDataFechamento(selectedDate);
    }
  };

  const limparDataFechamento = () => {
    setDataFechamento(null);
  };

  const formatDate = (date) => {
    if (!date) return "DD/MM/AAAA (opcional)";
    return date.toLocaleDateString('pt-BR');
  };

  const handleSaveVitima = (vitimaData) => {
    // Aqui você pode implementar a lógica para salvar a vítima
    console.log('Dados da vítima:', vitimaData);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Adicionar Novo Caso</Text>

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o tipo..." value="" />
            {tipos.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o título do caso..."
        />

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Digite a descrição (opcional)..."
          multiline={true}
          numberOfLines={4}
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={status}
            onValueChange={(itemValue) => setStatus(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o status..." value="" />
            {statusOptions.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Nº do Processo</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o número do processo..."
          keyboardType="numeric"
        />

        <Text style={styles.label}>Data de abertura</Text>
        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={() => setShowAberturaPicker(true)}
        >
          <Icon name="calendar-today" size={24} color="gray" style={styles.icon} />
          <Text style={styles.dropdownPlaceholder}>{formatDate(dataAbertura)}</Text>
        </TouchableOpacity>
        {showAberturaPicker && (
          <DateTimePicker
            value={dataAbertura}
            mode="date"
            display="default"
            onChange={onAberturaChange}
          />
        )}

        <Text style={styles.label}>Data de fechamento</Text>
        <View style={styles.dateContainer}>
          <TouchableOpacity 
            style={[styles.inputContainer, styles.dateInputContainer]}
            onPress={() => setShowFechamentoPicker(true)}
          >
            <Icon name="calendar-today" size={24} color="gray" style={styles.icon} />
            <Text style={styles.dropdownPlaceholder}>{formatDate(dataFechamento)}</Text>
          </TouchableOpacity>
          {dataFechamento && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={limparDataFechamento}
            >
              <Icon name="close" size={24} color="#ff0000" />
            </TouchableOpacity>
          )}
        </View>
        {showFechamentoPicker && (
          <DateTimePicker
            value={dataFechamento || new Date()}
            mode="date"
            display="default"
            onChange={onFechamentoChange}
          />
        )}

        <Text style={styles.label}>Vítima</Text>
        <View style={styles.victimContainer}>
          <View style={[styles.inputContainer, styles.victimDropdown]}>
            <Icon name="arrow-drop-down" size={24} color="gray" style={styles.icon} />
            <Text style={styles.dropdownPlaceholder}>Selecione a vítima...</Text>
          </View>
          <Text style={styles.orText}>ou</Text>
          <TouchableOpacity 
            style={styles.createVictimButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.createVictimButtonText}>Criar vítima</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.buttonText}>Criar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        <ModalVitima 
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSaveVitima}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
    color: "#333",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: "#333",
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
  icon: {
    marginRight: 10,
  },
  dropdownPlaceholder: {
    flex: 1,
    color: 'gray',
    fontSize: 16,
  },
  victimContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  victimDropdown: {
    flex: 1,
    marginRight: 10,
  },
  orText: {
    fontSize: 16,
    marginRight: 10,
  },
  createVictimButton: {
    backgroundColor: "#357bd2",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  createVictimButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: "#87c05e",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelButton: {
    backgroundColor: "#ff0000",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  picker: {
    flex: 1,
    height: 50,
    width: '100%',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateInputContainer: {
    flex: 1,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
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
}); 