import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ModalCadastrarUsuario from "../../components/ModalCadastrarUsuario";
import ModalDetalhesUsuario from "../../components/ModalDetalhesUsuario";

export default function GerenciarUsuarios() {
  const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  // Dados de exemplo para a tabela
  const usuarios = [
    {
      id: 1,
      nome: "Administrador",
      email: "admin@stpericial.com",
      tipo: "Admin",
    },
    {
      id: 2,
      nome: "João Silva",
      email: "perito.joao@stpericial.com",
      tipo: "Perito",
    },
    {
      id: 3,
      nome: "Maria Santos",
      email: "assistente.maria@stpericial.com",
      tipo: "Assistente",
    },
    {
      id: 4,
      nome: "Pedro Oliveira",
      email: "perito.pedro@stpericial.com",
      tipo: "Perito",
    },
  ];

  const handleSaveUsuario = (usuarioData) => {
    // Aqui você implementará a lógica para salvar o usuário
    console.log('Dados do usuário:', usuarioData);
    setModalCadastroVisible(false);
  };

  const handleOpenDetalhes = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalDetalhesVisible(true);
  };

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
          <View key={usuario.id} style={styles.tableRow}>
            <Text style={[styles.cell, styles.emailCell]}>{usuario.email}</Text>
            <Text style={styles.cell}>{usuario.tipo}</Text>
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
}); 