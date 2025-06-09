import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import ModalAdicionarEvidencia from '../../components/ModalAdicionarEvidencia';

export default function DetalhesCaso({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  // Dados de exemplo (posteriormente virão da API)
  const caso = {
    id: "CASE-001",
    tipo: "Homicídio",
    titulo: "Caso de Homicídio - João Silva",
    status: "Em andamento",
    descricao: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    dataAbertura: "15/03/2024",
    dataFechamento: null,
    responsavel: "Dr. Silva",
    vitima: "João Silva",
    dataCriacao: "15/03/2024 10:30",
    ultimaAtualizacao: "16/03/2024 15:45",
    evidencias: [
      {
        id: "EVD-001",
        tipo: "imagem",
        descricao: "Foto da cena do crime",
        dataColeta: "15/03/2024 11:00",
        coletadoPor: "Dr. Silva",
        url: require('../../assets/placeholderevidencia.jpg'),
      },
      {
        id: "EVD-002",
        tipo: "documento",
        descricao: "Relatório inicial",
        dataColeta: "15/03/2024 12:00",
        coletadoPor: "Dra. Santos",
      },
      {
        id: "EVD-003",
        tipo: "video",
        descricao: "Gravação da cena",
        dataColeta: "15/03/2024 13:00",
        coletadoPor: "Dr. Silva",
        url: require('../../assets/placeholderevidencia.jpg'),
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Em andamento":
        return "#FFD700";
      case "Finalizado":
        return "#87c05e";
      case "Arquivado":
        return "#FFA500";
      default:
        return "#ccc";
    }
  };

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

  const renderEvidenciaCard = (evidencia) => {
    return (
      <View key={evidencia.id} style={styles.evidenciaCard}>
        {(evidencia.tipo === 'imagem' || evidencia.tipo === 'video') && (
          <Image
            source={evidencia.url}
            style={styles.evidenciaPreview}
            resizeMode="cover"
          />
        )}
        <View style={styles.evidenciaInfo}>
          <Text style={styles.evidenciaId}>{evidencia.id}</Text>
          <Text style={styles.evidenciaTipo}>Tipo: {evidencia.tipo}</Text>
          <Text style={styles.evidenciaDescricao}>{evidencia.descricao}</Text>
          <Text style={styles.evidenciaData}>Data de coleta: {evidencia.dataColeta}</Text>
          <Text style={styles.evidenciaColetor}>Coletado por: {evidencia.coletadoPor}</Text>
          
          <View style={styles.evidenciaActions}>
            <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
              <Feather name="edit-2" size={20} color="#87c05e" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
              <Feather name="trash-2" size={20} color="#ff4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const handleSaveEvidencias = (novasEvidencias) => {
    // Aqui você implementará a lógica para salvar as evidências
    console.log('Salvando evidências:', novasEvidencias);
    setModalVisible(false);
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.casoId}>{caso.id}</Text>
      
      <View style={styles.tipoContainer}>
        <Text style={styles.tipo}>{caso.tipo}</Text>
      </View>

      <Text style={styles.titulo}>{caso.titulo}</Text>

      <View style={[styles.statusContainer, { backgroundColor: getStatusColor(caso.status) }]}>
        {getStatusIcon(caso.status)}
        <Text style={styles.status}>{caso.status}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Descrição</Text>
        <Text style={styles.descricao}>{caso.descricao}</Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Abertura</Text>
          <Text style={styles.infoValue}>{caso.dataAbertura}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Fechamento</Text>
          <Text style={styles.infoValue}>{caso.dataFechamento || "Não informado"}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Responsável</Text>
          <Text style={styles.infoValue}>{caso.responsavel}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Vítima</Text>
          <Text style={styles.infoValue}>{caso.vitima || "Sem vítima"}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Data de Criação</Text>
          <Text style={styles.infoValue}>{caso.dataCriacao}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Última Atualização</Text>
          <Text style={styles.infoValue}>{caso.ultimaAtualizacao}</Text>
        </View>
      </View>

      <View style={styles.evidenciasSection}>
        <View style={styles.evidenciasHeader}>
          <Text style={styles.sectionTitle}>Evidências</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Feather name="file-plus" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Adicionar evidência</Text>
          </TouchableOpacity>
        </View>
        {caso.evidencias.map(renderEvidenciaCard)}
      </View>

      <ModalAdicionarEvidencia
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveEvidencias}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  casoId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  tipoContainer: {
    backgroundColor: '#357bd2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  tipo: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  status: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#333',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  descricao: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  infoItem: {
    width: '50%',
    marginBottom: 15,
    paddingRight: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  evidenciasSection: {
    marginTop: 20,
  },
  evidenciasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  evidenciaCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  evidenciaPreview: {
    width: '100%',
    height: 200,
  },
  evidenciaInfo: {
    padding: 15,
  },
  evidenciaId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  evidenciaTipo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  evidenciaDescricao: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  evidenciaData: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  evidenciaColetor: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#87c05e',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  evidenciaActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  editButton: {
    borderColor: '#87c05e',
  },
  deleteButton: {
    borderColor: '#ff4444',
  },
}); 