import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalRegistroOdontologico from "../../components/ModalRegistroOdontologico";
import ModalDetalhesRegistroOdontologico from "../../components/ModalDetalhesRegistroOdontologico";

export default function RegistrosOdontologicos() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);

  // Dados de exemplo para a tabela
  const registros = [
    {
      id: 1,
      vitima: "João Silva",
      notas: "Exame odontológico realizado em 15/03/2024. Identificação de características dentárias específicas.",
      dentesAusentes: ["11", "12", "21"],
      marcasOdontologicas: "Restauração em resina composta",
      observacoes: "Paciente apresenta boa higiene bucal. Necessário acompanhamento periódico.",
    },
    {
      id: 2,
      vitima: "Maria Santos",
      notas: "Registro de arcada dentária superior e inferior. Documentação fotográfica realizada.",
      dentesAusentes: ["16", "26"],
      marcasOdontologicas: "Prótese parcial removível",
      observacoes: "Documentação fotográfica completa realizada. Arcada superior com ausência de molares.",
    },
    {
      id: 3,
      vitima: "Pedro Oliveira",
      notas: "Análise de restaurações e próteses dentárias. Mapeamento completo da arcada.",
      dentesAusentes: ["31", "32", "41", "42"],
      marcasOdontologicas: "Prótese total superior",
      observacoes: "Paciente edêntulo total na arcada superior. Prótese total em bom estado de conservação.",
    },
  ];

  const handleSaveRegistro = (registro) => {
    console.log("Novo registro:", registro);
    // Aqui você implementará a lógica para salvar o registro
  };

  const handleOpenDetalhes = (registro) => {
    setRegistroSelecionado(registro);
    setModalDetalhesVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Registros Odontológicos</Text>

      <TouchableOpacity 
        style={styles.createButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createButtonText}>Criar Registro</Text>
      </TouchableOpacity>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.vitimaCell]}>Vítima</Text>
          <Text style={[styles.headerCell, styles.notasCell]}>Notas</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {registros.map((registro) => (
          <View key={registro.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.vitimaCell]}>{registro.vitima}</Text>
            <Text style={[styles.cell, styles.notasCell]}>{registro.notas}</Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleOpenDetalhes(registro)}
              >
                <Icon name="assignment" size={24} color="#357bd2" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <ModalRegistroOdontologico
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveRegistro}
      />

      <ModalDetalhesRegistroOdontologico
        visible={modalDetalhesVisible}
        onClose={() => setModalDetalhesVisible(false)}
        registro={registroSelecionado}
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
  createButton: {
    backgroundColor: "#357bd2",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  vitimaCell: {
    flex: 1,
  },
  notasCell: {
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
}); 