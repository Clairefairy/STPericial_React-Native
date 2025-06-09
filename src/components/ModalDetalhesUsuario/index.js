import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalEditarUsuario from "../ModalEditarUsuario";
import api from "../../services/api";

export default function ModalDetalhesUsuario({ visible, onClose, usuario, onUpdate }) {
  const [modalEditarVisible, setModalEditarVisible] = useState(false);

  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'perito':
        return 'Perito';
      case 'assistente':
        return 'Assistente';
      default:
        return 'Não definido';
    }
  };

  const handleEditar = async (usuarioData) => {
    try {
      await api.put(`/api/users/${usuario._id}`, usuarioData);
      setModalEditarVisible(false);
      onUpdate(); // Atualiza a lista de usuários
      Alert.alert('Sucesso', 'Usuário atualizado com sucesso!');
    } catch (err) {
      console.error("Erro ao editar usuário:", err);
      Alert.alert('Erro', 'Não foi possível editar o usuário. Tente novamente.');
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este usuário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/api/users/${usuario._id}`);
              onClose();
              onUpdate(); // Atualiza a lista de usuários
              Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
            } catch (err) {
              console.error("Erro ao excluir usuário:", err);
              Alert.alert('Erro', 'Não foi possível excluir o usuário. Tente novamente.');
            }
          },
        },
      ],
    );
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalhes do Usuário</Text>
            
            <ScrollView style={styles.modalScroll}>
              <View style={styles.infoSection}>
                <Text style={styles.label}>Nome Completo</Text>
                <Text style={styles.value}>{usuario?.name || "Não informado"}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{usuario?.email || "Não informado"}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.label}>Tipo</Text>
                <Text style={styles.value}>{formatRole(usuario?.role)}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.editButton]}
                  onPress={() => setModalEditarVisible(true)}
                >
                  <Icon name="edit" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleExcluir}
                >
                  <Icon name="delete" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={[styles.button, styles.closeButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ModalEditarUsuario
        visible={modalEditarVisible}
        onClose={() => setModalEditarVisible(false)}
        onSave={handleEditar}
        usuario={usuario}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: 80,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScroll: {
    maxHeight: '100%',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  closeButton: {
    backgroundColor: "#357bd2",
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
}); 