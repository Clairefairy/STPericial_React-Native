import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import ModalVitima from "../../components/ModalVitima";
import api from '../../services/api';
import { useNavigation } from "@react-navigation/native";

export default function AdicionarCaso() {
  const navigation = useNavigation();
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

  // Estados para os campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [numberProcess, setNumberProcess] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [responsible, setResponsible] = useState('');
  const [victim, setVictim] = useState('');
  const [usuarios, setUsuarios] = useState([]); // lista de responsáveis
  const [vitimas, setVitimas] = useState([]); // lista de vítimas
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchVictim, setSearchVictim] = useState('');
  const [filteredVictims, setFilteredVictims] = useState([]);
  const [showVictimSuggestions, setShowVictimSuggestions] = useState(false);

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

  // Função para criar caso
  const handleCreateCase = async () => {
    if (!tipo || !title || !status) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mapeia status para o enum do backend
      let statusMapped = '';
      if (status === 'Em andamento') statusMapped = 'em_andamento';
      else if (status === 'Finalizado') statusMapped = 'finalizado';
      else if (status === 'Arquivado') statusMapped = 'arquivado';
      else statusMapped = 'em_andamento';

      const payload = {
        type: tipo,
        title,
        description,
        status: statusMapped,
        numberProcess,
        openingDate: dataAbertura.toISOString(),
        closingDate: dataFechamento ? dataFechamento.toISOString() : undefined,
        responsible: responsible || undefined,
        victim: victim || undefined,
      };

      await api.post('/api/cases', payload);
      setIsSuccess(true);
      setFeedbackMessage('Caso criado com sucesso!');
      setShowFeedbackModal(true);
      
      // Limpar todos os campos
      setTipo('');
      setTitle('');
      setDescription('');
      setStatus('');
      setNumberProcess('');
      setDataAbertura(new Date());
      setDataFechamento(null);
      setResponsible('');
      setVictim('');
      setSearchVictim('');
    } catch (err) {
      setIsSuccess(false);
      if (err.response && err.response.data && err.response.data.message) {
        setFeedbackMessage(err.response.data.message);
      } else {
        setFeedbackMessage('Erro ao criar caso. Verifique os dados e tente novamente.');
      }
      setShowFeedbackModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    if (isSuccess) {
      navigation.goBack();
    }
  };

  const handleVictimSearch = (text) => {
    setSearchVictim(text);
    if (text.length > 0) {
      const filtered = vitimas.filter(v => 
        (v.name?.toLowerCase().includes(text.toLowerCase()) || 
         v._id.toLowerCase().includes(text.toLowerCase()))
      );
      setFilteredVictims(filtered);
      setShowVictimSuggestions(true);
    } else {
      setFilteredVictims([]);
      setShowVictimSuggestions(false);
    }
  };

  const handleVictimSelect = (selectedVictim) => {
    setVictim(selectedVictim._id);
    setSearchVictim(selectedVictim.name || 'Vítima sem nome');
    setShowVictimSuggestions(false);
  };

  const handleClearVictim = () => {
    setVictim('');
    setSearchVictim('');
  };

  const renderVictimItem = ({ item }) => (
    <TouchableOpacity
      style={styles.victimSuggestionItem}
      onPress={() => handleVictimSelect(item)}
    >
      <Text style={styles.victimSuggestionText}>
        {item.name || 'Vítima sem nome'}
      </Text>
      <Text style={styles.victimSuggestionId}>
        {item._id}
      </Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Busca apenas usuários com perfil de perito
        const respUsuarios = await api.get("/api/users/");
        setUsuarios(respUsuarios.data);
        const respVitimas = await api.get("/api/victims/");
        setVitimas(respVitimas.data);
      } catch (err) {
        // Pode exibir erro se quiser
      }
    };
    fetchData();
  }, []);

  const renderFormItem = () => (
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
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Digite a descrição (opcional)..."
        multiline={true}
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
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
        value={numberProcess}
        onChangeText={setNumberProcess}
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

      <Text style={styles.label}>Responsável</Text>
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={responsible}
          onValueChange={setResponsible}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o responsável..." value="" />
          {usuarios.map((user) => (
            <Picker.Item key={user._id} label={user.nome || user.email} value={user._id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Vítima</Text>
      <View style={styles.victimSearchContainer}>
        <View style={styles.victimInputWrapper}>
          <TextInput
            style={[
              styles.victimSearchInput,
              victim && styles.victimSearchInputDisabled
            ]}
            placeholder="Pesquisar vítima por nome ou ID..."
            value={searchVictim}
            onChangeText={handleVictimSearch}
            onFocus={() => !victim && setShowVictimSuggestions(true)}
            editable={!victim}
          />
          {victim && (
            <TouchableOpacity
              style={styles.clearVictimButton}
              onPress={handleClearVictim}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {showVictimSuggestions && filteredVictims.length > 0 && !victim && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={filteredVictims}
              renderItem={renderVictimItem}
              keyExtractor={item => item._id}
              style={styles.suggestionsList}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            />
          </View>
        )}
      </View>
      <Text style={{textAlign:'center', color:'#888', marginBottom:10}}>Ou crie uma nova vítima abaixo:</Text>
      <TouchableOpacity 
        style={styles.createVictimButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createVictimButtonText}>Criar vítima</Text>
      </TouchableOpacity>

      {error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{error}</Text>
      ) : null}
      {success ? (
        <Text style={{ color: 'green', textAlign: 'center', marginBottom: 10 }}>{success}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.createButton, loading && styles.disabledButton]} 
          onPress={handleCreateCase} 
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Criando...' : 'Criar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerBar} />
      <FlatList
        data={[1]} // Array com um único item para renderizar o formulário
        renderItem={renderFormItem}
        keyExtractor={() => 'form'}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      />

      <ModalVitima 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveVitima}
      />

      {/* Modal de Feedback */}
      <Modal
        visible={showFeedbackModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.feedbackModalContent}>
            <Text style={[
              styles.feedbackTitle,
              { color: isSuccess ? '#87c05e' : '#ff4444' }
            ]}>
              {isSuccess ? 'Sucesso!' : 'Atenção!'}
            </Text>
            <Text style={styles.feedbackMessage}>{feedbackMessage}</Text>
            <TouchableOpacity
              style={[
                styles.feedbackButton,
                { backgroundColor: isSuccess ? '#87c05e' : '#ff4444' }
              ]}
              onPress={handleFeedbackClose}
            >
              <Text style={styles.feedbackButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerBar: {
    height: 120,
    backgroundColor: '#357bd2',
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 300,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -60,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
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
  disabledButton: {
    opacity: 0.7,
  },
  feedbackModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  feedbackMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  feedbackButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  victimSearchContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  victimInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  victimSearchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  victimSearchInputDisabled: {
    backgroundColor: '#f5f5f5',
  },
  clearVictimButton: {
    padding: 10,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  victimSuggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  victimSuggestionText: {
    fontSize: 16,
    color: '#333',
  },
  victimSuggestionId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});