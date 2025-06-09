import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function ModalDetalhesRegistroOdontologico({
  visible,
  onClose,
  registro,
}) {
  if (!registro) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Detalhes do Registro Odontológico</Text>

          <ScrollView style={styles.scrollView}>
            {/* Vítima */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vítima</Text>
              <Text style={styles.sectionContent}>{registro.vitima}</Text>
            </View>

            {/* Dentes Ausentes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dentes Ausentes</Text>
              <View style={styles.dentesList}>
                {registro.dentesAusentes && registro.dentesAusentes.length > 0 ? (
                  registro.dentesAusentes.map((dente, index) => (
                    <View key={index} style={styles.denteItem}>
                      <Text style={styles.denteText}>{dente}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noData}>Nenhum dente ausente registrado</Text>
                )}
              </View>
            </View>

            {/* Marcas Odontológicas */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Marcas Odontológicas</Text>
              <Text style={styles.sectionContent}>
                {registro.marcasOdontologicas || "Nenhuma marca odontológica registrada"}
              </Text>
            </View>

            {/* Observações */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações</Text>
              <Text style={styles.sectionContent}>
                {registro.observacoes || "Nenhuma observação registrada"}
              </Text>
            </View>
          </ScrollView>

          {/* Botão de Fechar */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#357bd2",
  },
  sectionContent: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  dentesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  denteItem: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  denteText: {
    fontSize: 16,
    color: "#333",
  },
  noData: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  closeButton: {
    backgroundColor: "#357bd2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 