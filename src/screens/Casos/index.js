import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import Icon from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Casos() {
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [responsavelFilter, setResponsavelFilter] = useState("");
  const [ordenacao, setOrdenacao] = useState("Mais recentes");

  // Dados de exemplo para a tabela
  const casos = [
    {
      id: 1,
      titulo: "Caso de Homicídio - João Silva",
      status: "Em andamento",
      dataAbertura: "15/03/2024",
    },
    {
      id: 2,
      titulo: "Acidente de Trânsito - Maria Santos",
      status: "Finalizado",
      dataAbertura: "10/03/2024",
    },
    {
      id: 3,
      titulo: "Lesões Corporais - Pedro Oliveira",
      status: "Arquivado",
      dataAbertura: "05/03/2024",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Em andamento":
        return <MaterialCommunityIcons name="briefcase-clock" size={20} color="#FFD700" />;
      case "Finalizado":
        return <MaterialCommunityIcons name="briefcase-check" size={20} color="#87c05e" />;
      case "Arquivado":
        return <FontAwesome5 name="archive" size={20} color="#FFA500" />;
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Casos</Text>

      {/* Filtros */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={statusFilter}
              onValueChange={(itemValue) => setStatusFilter(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Todos" value="Todos" />
              <Picker.Item label="Arquivado" value="Arquivado" />
              <Picker.Item label="Em andamento" value="Em andamento" />
              <Picker.Item label="Finalizado" value="Finalizado" />
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Responsável</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={responsavelFilter}
              onValueChange={(itemValue) => setResponsavelFilter(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Todos" value="" />
              <Picker.Item label="Dr. Silva" value="Dr. Silva" />
              <Picker.Item label="Dra. Santos" value="Dra. Santos" />
            </Picker>
          </View>
        </View>

        <View style={styles.filterItem}>
          <Text style={styles.filterLabel}>Ordenar por</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ordenacao}
              onValueChange={(itemValue) => setOrdenacao(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Mais recentes" value="Mais recentes" />
              <Picker.Item label="Mais antigos" value="Mais antigos" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.titleCell]}>Título</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Abertura</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {casos.map((caso) => (
          <View key={caso.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.titleCell]}>{caso.titulo}</Text>
            <View style={styles.cell}>
              {getStatusIcon(caso.status)}
            </View>
            <Text style={styles.cell}>{caso.dataAbertura}</Text>
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
  filtersContainer: {
    marginBottom: 20,
  },
  filterItem: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
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
    flex: 2,
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