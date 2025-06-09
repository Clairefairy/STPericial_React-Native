import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalCadastrarUsuario from "../../components/ModalCadastrarUsuario";
import ModalDetalhesUsuario from "../../components/ModalDetalhesUsuario";
import api from "../../services/api";

export default function GerenciarUsuarios() {
  const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users');
      setUsuarios(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar usuários");
      console.error("Erro ao buscar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSaveUsuario = async (usuarioData) => {
    try {
      await api.post('/api/users', usuarioData);
      await fetchUsuarios(); // Recarrega a lista após cadastrar
      setModalCadastroVisible(false);
    } catch (err) {
      console.error("Erro ao cadastrar usuário:", err);
      setError("Erro ao cadastrar usuário");
    }
  };

  const handleOpenDetalhes = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalDetalhesVisible(true);
  };

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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#357bd2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Usuários</Text>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalCadastroVisible(true)}
      >
        <Icon name="person-add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Cadastrar Usuário</Text>
      </TouchableOpacity>

      {/* Tabela */}
      <View style={styles.tableContainer}>
        {/* Cabeçalho da tabela */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.emailCell]}>Email</Text>
          <Text style={styles.headerCell}>Tipo</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        {/* Linhas da tabela */}
        {usuarios.map((usuario) => (
          <View key={usuario._id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.emailCell]}>{usuario.email}</Text>
            <Text style={styles.cell}>{formatRole(usuario.role)}</Text>
            <View style={styles.actionsCell}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleOpenDetalhes(usuario)}
              >
                <Icon name="assignment" size={24} color="#357bd2" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <ModalCadastrarUsuario
        visible={modalCadastroVisible}
        onClose={() => setModalCadastroVisible(false)}
        onSave={handleSaveUsuario}
      />

      <ModalDetalhesUsuario
        visible={modalDetalhesVisible}
        onClose={() => setModalDetalhesVisible(false)}
        usuario={usuarioSelecionado}
        onUpdate={fetchUsuarios}
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
  addButton: {
    backgroundColor: "#357bd2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
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
  emailCell: {
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
}); 