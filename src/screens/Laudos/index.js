import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Laudos() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLaudo, setSelectedLaudo] = useState(null);

  // Dados de exemplo para a tabela
  const laudos = [
    {
      id: 1,
      titulo: "Laudo de Exame de DNA - Caso João Silva",
      dataEmissao: "15/03/2024",
      responsavel: "Dr. Carlos Silva",
      evidenciaId: "EVD-001",
    },
    {
      id: 2,
      titulo: "Laudo de Exame Toxicológico - Caso Maria Santos",
      dataEmissao: "10/03/2024",
      responsavel: "Dra. Ana Santos",
      evidenciaId: "EVD-002",
    },
    {
      id: 3,
      titulo: "Laudo de Exame de Balística - Caso Pedro Oliveira",
      dataEmissao: "05/03/2024",
      responsavel: "Dr. Roberto Oliveira",
      evidenciaId: "EVD-003",
    },
  ];

  const handleDetalhes = (laudo) => {
    setSelectedLaudo(laudo);
    setModalVisible(true);
  };

  const handleDownload = () => {
    // Implementar lógica de download
    console.log('Download do laudo:', selectedLaudo.id);
  };

  const handleExcluir = () => {
    // Implementar lógica de exclusão
    console.log('Excluir laudo:', selectedLaudo.id);
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Laudos</Text>

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
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDetalhes(laudo)}
              >
                <Icon name="assignment" size={24} color="#357bd2" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Modal de Detalhes */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes do Laudo</Text>
            
            <View style={styles.modalInfoContainer}>
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Evidência:</Text>
                <Text style={styles.modalValue}>{selectedLaudo?.evidenciaId}</Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Data de Emissão:</Text>
                <Text style={styles.modalValue}>{selectedLaudo?.dataEmissao}</Text>
              </View>
              
              <View style={styles.modalInfoRow}>
                <Text style={styles.modalLabel}>Responsável:</Text>
                <Text style={styles.modalValue}>{selectedLaudo?.responsavel}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.downloadButton]}
                onPress={handleDownload}
              >
                <FontAwesome5 name="download" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Baixar Laudo</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleExcluir}
              >
                <Icon name="delete" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    position: 'relative',
    paddingBottom: 80,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInfoContainer: {
    marginBottom: 20,
  },
  modalInfoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  modalValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  downloadButton: {
    backgroundColor: '#357bd2',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#357bd2',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
}); 