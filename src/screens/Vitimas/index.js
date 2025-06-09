import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalDetalhesVitima from "../../components/ModalDetalhesVitima";
import { Picker } from "@react-native-picker/picker";
import api from "../../services/api";

export default function Vitimas() {
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [vitimaSelecionada, setVitimaSelecionada] = useState(null);
  const [vitimas, setVitimas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Campos para cadastro de vítima
  const [name, setName] = useState("");
  const [sex, setSex] = useState("");
  const [dateBirth, setDateBirth] = useState("");
  const [identification, setIdentification] = useState("");
  const [identified, setIdentified] = useState(true);
  const [observations, setObservations] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [age, setAge] = useState("");

  // Buscar vítimas do backend
  useEffect(() => {
    const fetchVitimas = async () => {
      setLoading(true);
      try {
        const resp = await api.get("/api/victims/");
        setVitimas(resp.data);
      } catch (err) {
        setError("Erro ao buscar vítimas");
      } finally {
        setLoading(false);
      }
    };
    fetchVitimas();
  }, []);

  // Função para cadastrar vítima
  const handleAddVitima = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const payload = {
        name,
        sex,
        dateBirth: dateBirth ? new Date(dateBirth) : undefined,
        identification: identification || undefined,
        identified,
        observations: observations || undefined,
        ethnicity,
        age: age ? Number(age) : undefined,
      };
      await api.post("/api/victims/", payload);
      setSuccess("Vítima cadastrada com sucesso!");
      setName("");
      setSex("");
      setDateBirth("");
      setIdentification("");
      setIdentified(true);
      setObservations("");
      setEthnicity("");
      setAge("");
      // Atualiza lista de vítimas
      const resp = await api.get("/api/victims/");
      setVitimas(resp.data);
    } catch (err) {
      setError("Erro ao cadastrar vítima");
    } finally {
      setLoading(false);
    }
  };

  const getSexoLabel = (sexo) => {
    switch (sexo) {
      case "M":
        return "Masculino";
      case "F":
        return "Feminino";
      case "O":
        return "Outro";
      default:
        return sexo;
    }
  };

  const handleOpenDetalhes = (vitima) => {
    setVitimaSelecionada(vitima);
    setModalDetalhesVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Vítimas</Text>

      {/* Formulário de cadastro de vítima */}
      <View
        style={{
          marginBottom: 24,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 8,
          }}
        >
          Cadastrar Nova Vítima
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={sex}
            onValueChange={setSex}
            style={styles.picker}
          >
            <Picker.Item label="Selecione o sexo..." value="" />
            <Picker.Item label="Masculino" value="masculino" />
            <Picker.Item label="Feminino" value="feminino" />
            <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Data de nascimento (YYYY-MM-DD)"
          value={dateBirth}
          onChangeText={setDateBirth}
        />
        <TextInput
          style={styles.input}
          placeholder="Identificação (opcional)"
          value={identification}
          onChangeText={setIdentification}
        />
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={ethnicity}
            onValueChange={setEthnicity}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a etnia..." value="" />
            <Picker.Item label="Branca" value="branca" />
            <Picker.Item label="Preta" value="preta" />
            <Picker.Item label="Parda" value="parda" />
            <Picker.Item label="Amarela" value="amarela" />
            <Picker.Item label="Indígena" value="indigena" />
            <Picker.Item label="Outro" value="outro" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Idade (opcional)"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Observações (opcional)"
          value={observations}
          onChangeText={setObservations}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ marginRight: 8 }}>Identificada?</Text>
          <TouchableOpacity
            onPress={() => setIdentified(true)}
            style={{ marginRight: 8 }}
          >
            <Text style={{ color: identified ? "#357bd2" : "#888" }}>Sim</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIdentified(false)}>
            <Text style={{ color: !identified ? "#357bd2" : "#888" }}>Não</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.createVictimButton, { marginTop: 8 }]}
          onPress={handleAddVitima}
          disabled={loading}
        >
          <Text style={styles.createVictimButtonText}>
            {loading ? "Salvando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>
        {error ? (
          <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>
        ) : null}
        {success ? (
          <Text style={{ color: "green", textAlign: "center" }}>{success}</Text>
        ) : null}
      </View>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.nomeCell]}>Nome</Text>
          <Text style={styles.headerCell}>Sexo</Text>
          <Text style={styles.headerCell}>Etnia</Text>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {vitimas.map((vitima) => (
          <View key={vitima._id || vitima.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.nomeCell]}>{vitima.name}</Text>
            <Text style={styles.cell}>{getSexoLabel(vitima.sex)}</Text>
            <Text style={styles.cell}>{vitima.ethnicity}</Text>
            <View style={styles.cell}>
              {vitima.identified ? (
                <Icon name="check-circle" size={24} color="#87c05e" />
              ) : (
                <Icon name="cancel" size={24} color="#ff0000" />
              )}
            </View>
            <View style={styles.actionsCell}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleOpenDetalhes(vitima)}
              >
                <Icon name="assignment" size={24} color="#357bd2" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <ModalDetalhesVitima
        visible={modalDetalhesVisible}
        onClose={() => setModalDetalhesVisible(false)}
        vitima={vitimaSelecionada}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#357bd2",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  nomeCell: {
    flex: 2,
  },
  actionsCell: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    padding: 5,
    minWidth: 40,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  createVictimButton: {
    backgroundColor: "#357bd2",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  createVictimButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});