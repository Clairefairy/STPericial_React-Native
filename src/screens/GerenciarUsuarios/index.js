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
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>Gerenciamento de Usuários</Text>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalCadastroVisible(true)}
      >
        <Icon name="person-add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Cadastrar Usuário</Text>
      </TouchableOpacity>

      {/* Cards */}
      <View style={styles.cardsContainer}>
        {usuarios.map((usuario, index) => (
          <TouchableOpacity
            key={usuario._id}
            style={[
              styles.card,
              { backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#e8f0f8' }
            ]}
            onPress={() => handleOpenDetalhes(usuario)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{usuario.email}</Text>
              <View style={styles.roleContainer}>
                <Text style={styles.roleText}>{formatRole(usuario.role)}</Text>
              </View>
            </View>
            {usuario.name && (
              <View style={styles.cardInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nome:</Text>
                  <Text style={styles.infoValue}>{usuario.name}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
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

      {/* Margem para o Tab Navigator */}
      <View style={styles.bottomMargin} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
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
  cardsContainer: {
    paddingBottom: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  roleContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  cardInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
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
  bottomMargin: {
    height: 50, // Adjust this value based on your tab navigator height
  },
}); 