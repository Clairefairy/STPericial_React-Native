import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';
import ModalVitima from '../../components/ModalVitima';
import ModalDetalhesVitima from '../../components/ModalDetalhesVitima';

export default function GerenciarVitimas() {
  const [modalCadastroVisible, setModalCadastroVisible] = useState(false);
  const [modalDetalhesVisible, setModalDetalhesVisible] = useState(false);
  const [vitimaSelecionada, setVitimaSelecionada] = useState(null);

  // Dados de exemplo (posteriormente virão da API)
  const vitimas = [
    {
      id: 1,
      nome: "João Silva",
      sexo: "M",
      etnia: "Branco",
      identificado: true,
    },
    {
      id: 2,
      nome: "Maria Santos",
      sexo: "F",
      etnia: "Pardo",
      identificado: true,
    },
    {
      id: 3,
      nome: "Não identificado",
      sexo: "O",
      etnia: "Não informado",
      identificado: false,
    },
  ];

  const getSexoLabel = (sexo) => {
    return sexo;
  };

  const handleOpenDetalhes = (vitima) => {
    setVitimaSelecionada(vitima);
    setModalDetalhesVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciamento de Vítimas</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalCadastroVisible(true)}
      >
        <Feather name="user-plus" size={20} color="#fff" />
        <Text style={styles.addButtonText}>Cadastrar Vítima</Text>
      </TouchableOpacity>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.nomeCell]}>Nome</Text>
          <Text style={styles.headerCell}>Sexo</Text>
          <Text style={styles.headerCell}>Etnia</Text>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.headerCell}>Detalhes</Text>
        </View>

        <ScrollView style={styles.tableBody}>
          {vitimas.map((vitima) => (
            <View key={vitima.id} style={styles.tableRow}>
              <Text style={[styles.cell, styles.nomeCell]}>{vitima.nome}</Text>
              <Text style={styles.cell}>{getSexoLabel(vitima.sexo)}</Text>
              <Text style={styles.cell}>{vitima.etnia}</Text>
              <View style={styles.cell}>
                {vitima.identificado ? (
                  <Icon name="check-circle" size={24} color="#87c05e" />
                ) : (
                  <Icon name="cancel" size={24} color="#ff4444" />
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
        </ScrollView>
      </View>

      <ModalVitima
        visible={modalCadastroVisible}
        onClose={() => setModalCadastroVisible(false)}
      />

      <ModalDetalhesVitima
        visible={modalDetalhesVisible}
        onClose={() => setModalDetalhesVisible(false)}
        vitima={vitimaSelecionada}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#357bd2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#357bd2',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nomeCell: {
    flex: 2,
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsCell: {
    flex: 0.5,
    alignItems: 'center',
  },
  actionButton: {
    padding: 5,
  },
}); 