import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ModalDetalhesVitima({ visible, onClose, vitima }) {
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalhes da Vítima</Text>
          
          <ScrollView style={styles.modalScroll}>
            <View style={styles.infoSection}>
              <Text style={styles.label}>Nome</Text>
              <Text style={styles.value}>{vitima?.nome || "Não informado"}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Sexo</Text>
              <Text style={styles.value}>{getSexoLabel(vitima?.sexo) || "Não informado"}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Etnia</Text>
              <Text style={styles.value}>{vitima?.etnia || "Não informado"}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.label}>Identificação</Text>
              <View style={styles.identificacaoContainer}>
                <Text style={styles.value}>
                  {vitima?.identificada ? "Identificada" : "Não Identificada"}
                </Text>
                {vitima?.identificada ? (
                  <Icon name="check-circle" size={24} color="#87c05e" />
                ) : (
                  <Icon name="cancel" size={24} color="#ff0000" />
                )}
              </View>
            </View>

            {vitima?.identificacao && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>Número de Identificação</Text>
                <Text style={styles.value}>{vitima.identificacao}</Text>
              </View>
            )}

            {vitima?.observacoes && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>Observações</Text>
                <Text style={styles.value}>{vitima.observacoes}</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.editButton]}>
              <Icon name="edit" size={24} color="#fff" />
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.deleteButton]}>
              <Icon name="delete" size={24} color="#fff" />
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
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
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalScroll: {
    maxHeight: "100%",
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#357bd2",
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: "#333",
  },
  identificacaoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    gap: 8,
  },
  editButton: {
    backgroundColor: "#357bd2",
  },
  deleteButton: {
    backgroundColor: "#ff0000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#357bd2",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 