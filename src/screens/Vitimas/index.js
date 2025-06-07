import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalDetalhesVitima from "../../components/ModalDetalhesVitima";

export default function Vitimas() {
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [vitimaSelecionada, setVitimaSelecionada] = useState(null);

  // Dados de exemplo para a tabela
  const vitimas = [
    {
      id: 1,
      nome: "João Silva",
      sexo: "M",
      etnia: "Branca",
      identificada: true,
      identificacao: "12345",
      observacoes: "Vítima encontrada no local do acidente."
    },
    {
      id: 2,
      nome: "Maria Santos",
      sexo: "F",
      etnia: "Parda",
      identificada: true,
      identificacao: "67890",
      observacoes: "Vítima transferida para o hospital central."
    },
    {
      id: 3,
      nome: "Pedro Oliveira",
      sexo: "M",
      etnia: "Negra",
      identificada: false,
    },
    {
      id: 4,
      nome: "Ana Costa",
      sexo: "F",
      etnia: "Indígena",
      identificada: true,
      identificacao: "54321",
    },
  ];

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
          <View key={vitima.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.nomeCell]}>{vitima.nome}</Text>
            <Text style={styles.cell}>{getSexoLabel(vitima.sexo)}</Text>
            <Text style={styles.cell}>{vitima.etnia}</Text>
            <View style={styles.cell}>
              {vitima.identificada ? (
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
}); 