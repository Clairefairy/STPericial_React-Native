import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Laudos() {
  // Dados de exemplo para a tabela
  const laudos = [
    {
      id: 1,
      titulo: "Laudo de Exame de DNA - Caso João Silva",
      dataEmissao: "15/03/2024",
      responsavel: "Dr. Carlos Silva",
    },
    {
      id: 2,
      titulo: "Laudo de Exame Toxicológico - Caso Maria Santos",
      dataEmissao: "10/03/2024",
      responsavel: "Dra. Ana Santos",
    },
    {
      id: 3,
      titulo: "Laudo de Exame de Balística - Caso Pedro Oliveira",
      dataEmissao: "05/03/2024",
      responsavel: "Dr. Roberto Oliveira",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Laudos</Text>

      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Criar Laudo</Text>
      </TouchableOpacity>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.titleCell]}>Título</Text>
          <Text style={styles.headerCell}>Emissão</Text>
          <Text style={[styles.headerCell, styles.responsavelCell]}>Responsável</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {laudos.map((laudo) => (
          <View key={laudo.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.titleCell]}>{laudo.titulo}</Text>
            <Text style={styles.cell}>{laudo.dataEmissao}</Text>
            <Text style={[styles.cell, styles.responsavelCell]}>{laudo.responsavel}</Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon name="assignment" size={24} color="#357bd2" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
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
  titleCell: {
    flex: 1.8,
  },
  responsavelCell: {
    flex: 1.5,
  },
  actionsCell: {
    flex: 1,
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