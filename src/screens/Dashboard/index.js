import React, { useState, useEffect, useMemo, memo } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { PieChart, BarChart } from "react-native-svg-charts";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import api from "../../services/api";
import { Grid, XAxis, YAxis } from 'react-native-svg-charts';

const screenWidth = Dimensions.get("window").width;

// Componente do gráfico de pizza memoizado
const PizzaChart = memo(({ data, loading }) => {
  const scaleAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [data]);

  if (loading) {
    return (
      <View style={{ height: 200, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2280b0" />
      </View>
    );
  }

  return (
    <Animated.View style={{ 
      height: 200,
      transform: [{ scale: scaleAnim }],
    }}>
      <PieChart
        style={{ height: 200 }}
        data={data}
        innerRadius={0}
        padAngle={0}
      />
    </Animated.View>
  );
});

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [casos, setCasos] = useState([]);
  const [vitimas, setVitimas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroDataAtivo, setFiltroDataAtivo] = useState(false);
  const [agruparPor, setAgruparPor] = useState("status");
  const [loadingChart, setLoadingChart] = useState(false);
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, filtroDataAtivo, agruparPor]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [casosResponse, vitimasResponse] = await Promise.all([
        api.get('/api/cases'),
        api.get('/api/victims')
      ]);

      const casosFiltrados = casosResponse.data.filter((caso) => {
        const dataCaso = new Date(caso.createdAt);
        return !filtroDataAtivo || (dataCaso >= startDate && dataCaso <= endDate);
      });
      
      setCasos(casosFiltrados);
      setVitimas(vitimasResponse.data);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setError("Erro ao carregar dados do dashboard");
      Alert.alert('Erro', 'Não foi possível carregar os dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getFaixaEtaria = (idade) => {
    if (!idade) return null;
    if (idade <= 1) return "Lactente";
    if (idade <= 12) return "Criança";
    if (idade <= 18) return "Adolescente";
    if (idade <= 30) return "Jovem Adulto";
    if (idade <= 64) return "Adulto";
    return "Idoso";
  };

  const getDadosAgrupados = () => {
    const dadosAgrupados = {};

    switch (agruparPor) {
      case "status":
        casos.forEach((caso) => {
          if (caso.status) {
            dadosAgrupados[caso.status] = (dadosAgrupados[caso.status] || 0) + 1;
          }
        });
        return Object.entries(dadosAgrupados).map(([key, value]) => ({
          value,
          svg: { fill: getCorStatus(key) },
          key,
          label: getLabelStatus(key),
        }));

      case "sexo":
        vitimas.forEach((vitima) => {
          if (vitima.sex) {
            dadosAgrupados[vitima.sex] = (dadosAgrupados[vitima.sex] || 0) + 1;
          }
        });
        return Object.entries(dadosAgrupados).map(([key, value]) => ({
          value,
          svg: { fill: getCorSexo(key) },
          key,
          label: getLabelSexo(key),
        }));

      case "etnia":
        vitimas.forEach((vitima) => {
          if (vitima.ethnicity) {
            dadosAgrupados[vitima.ethnicity] = (dadosAgrupados[vitima.ethnicity] || 0) + 1;
          }
        });
        return Object.entries(dadosAgrupados).map(([key, value]) => ({
          value,
          svg: { fill: getCorEtnia(key) },
          key,
          label: getLabelEtnia(key),
        }));

      case "faixa_etaria":
        vitimas.forEach((vitima) => {
          const faixa = getFaixaEtaria(vitima.age);
          if (faixa) {
            dadosAgrupados[faixa] = (dadosAgrupados[faixa] || 0) + 1;
          }
        });
        return Object.entries(dadosAgrupados).map(([key, value]) => ({
          value,
          svg: { fill: getCorFaixaEtaria(key) },
          key,
          label: key,
        }));
    }
  };

  const getCorStatus = (status) => {
    const cores = {
      arquivado: "#6c5ce7",
      em_andamento: "#00b894",
      finalizado: "#fdcb6e",
    };
    return cores[status] || "#95a5a6";
  };

  const getLabelStatus = (status) => {
    const labels = {
      arquivado: "Arquivado",
      em_andamento: "Em andamento",
      finalizado: "Finalizado",
    };
    return labels[status] || status;
  };

  const getCorSexo = (sexo) => {
    const cores = {
      feminino: "#e84393",
      masculino: "#0984e3",
      outro: "#636e72",
    };
    return cores[sexo] || "#95a5a6";
  };

  const getLabelSexo = (sexo) => {
    const labels = {
      feminino: "Feminino",
      masculino: "Masculino",
      outro: "Outro",
    };
    return labels[sexo] || sexo;
  };

  const getCorEtnia = (etnia) => {
    const cores = {
      preta: "#2d3436",
      parda: "#b2bec3",
      branca: "#dfe6e9",
      indigena: "#e17055",
      amarela: "#fdcb6e",
      outro: "#636e72",
    };
    return cores[etnia] || "#95a5a6";
  };

  const getLabelEtnia = (etnia) => {
    const labels = {
      preta: "Preta",
      parda: "Parda",
      branca: "Branca",
      indigena: "Indígena",
      amarela: "Amarela",
      outro: "Outro",
    };
    return labels[etnia] || etnia;
  };

  const getCorFaixaEtaria = (faixa) => {
    const cores = {
      "Lactente": "#74b9ff",
      "Criança": "#81ecec",
      "Adolescente": "#55efc4",
      "Jovem Adulto": "#00b894",
      "Adulto": "#00cec9",
      "Idoso": "#0984e3",
    };
    return cores[faixa] || "#95a5a6";
  };

  const getDadosUltimosMeses = () => {
    const hoje = new Date();
    const meses = [];
    const dadosPorMes = {};

    // Criar array com os últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesAno = data.toLocaleDateString('pt-BR', { month: 'short' });
      meses.push(mesAno);
      dadosPorMes[mesAno] = 0;
    }

    // Contar casos por mês
    casos.forEach((caso) => {
      if (caso.openingDate) {
        const dataCaso = new Date(caso.openingDate);
        const mesAno = dataCaso.toLocaleDateString('pt-BR', { month: 'short' });
        if (dadosPorMes[mesAno] !== undefined) {
          dadosPorMes[mesAno]++;
        }
      }
    });

    // Converter para o formato do gráfico
    return meses.map(mes => ({
      value: dadosPorMes[mes],
      svg: { fill: '#2280b0' },
      key: mes,
      label: mes
    }));
  };

  const dadosAgrupados = useMemo(() => {
    return getDadosAgrupados();
  }, [agruparPor, casos, vitimas]);

  const handleAgruparPorChange = (value) => {
    setLoadingChart(true);
    setTimeout(() => {
      setAgruparPor(value);
      setLoadingChart(false);
    }, 300);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f4f6f8" }}>
        <ActivityIndicator size="large" color="#357bd2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f4f6f8" }}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#f4f6f8" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          color: "#2d3436",
        }}
      >
        <FontAwesome5 name="chart-pie" size={20} /> Dashboard de Casos
      </Text>

      {/* Filtros */}
      <View
        style={{
          backgroundColor: "#fff",
          padding: 15,
          borderRadius: 12,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Filtros
        </Text>

        {/* Date Pickers */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setShowStart(true);
              setFiltroDataAtivo(true);
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="calendar-outline" size={18} color="#2d3436" />
            <Text style={{ marginLeft: 5 }}>
              Início: {filtroDataAtivo ? startDate.toLocaleDateString() : "Todos"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowEnd(true);
              setFiltroDataAtivo(true);
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="calendar-outline" size={18} color="#2d3436" />
            <Text style={{ marginLeft: 5 }}>
              Fim: {filtroDataAtivo ? endDate.toLocaleDateString() : "Todos"}
            </Text>
          </TouchableOpacity>
        </View>

        {showStart && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, date) => {
              setShowStart(false);
              if (date) {
                setStartDate(date);
                setFiltroDataAtivo(true);
              }
            }}
          />
        )}
        {showEnd && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, date) => {
              setShowEnd(false);
              if (date) {
                setEndDate(date);
                setFiltroDataAtivo(true);
              }
            }}
          />
        )}

        {/* Botão para limpar filtro de data */}
        {filtroDataAtivo && (
          <TouchableOpacity
            onPress={() => {
              setFiltroDataAtivo(false);
              setStartDate(new Date());
              setEndDate(new Date());
            }}
            style={{
              backgroundColor: "#e74c3c",
              padding: 8,
              borderRadius: 8,
              marginTop: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Limpar Filtro de Data</Text>
          </TouchableOpacity>
        )}

        {/* Picker de agrupamento */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ marginBottom: 5 }}>Agrupar por:</Text>
          <View
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}
          >
            <Picker
              selectedValue={agruparPor}
              onValueChange={handleAgruparPorChange}
              style={{ height: 50 }}
            >
              <Picker.Item label="Status do Caso" value="status" />
              <Picker.Item label="Sexo da Vítima" value="sexo" />
              <Picker.Item label="Etnia da Vítima" value="etnia" />
              <Picker.Item label="Faixa Etária da Vítima" value="faixa_etaria" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Gráfico de pizza */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 15,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Distribuição por {agruparPor === "status" ? "Status" : 
                         agruparPor === "sexo" ? "Sexo" :
                         agruparPor === "etnia" ? "Etnia" : "Faixa Etária"}
        </Text>
        <PizzaChart data={dadosAgrupados} loading={loadingChart} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 10 }}>
          {dadosAgrupados.map((item) => (
            <View key={item.key} style={{ flexDirection: "row", alignItems: "center", margin: 5 }}>
              <View style={{ width: 12, height: 12, backgroundColor: item.svg.fill, marginRight: 5 }} />
              <Text>{item.label}: {item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Gráfico de barras - Últimos 6 meses */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 15,
          marginBottom: 150,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Casos por Mês (Últimos 6 meses)
        </Text>
        <View style={{ height: 220, flexDirection: 'row', justifyContent: 'center', paddingLeft: 20 }}>
          <YAxis
            data={getDadosUltimosMeses()}
            yAccessor={({ item }) => item.value}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{ fill: 'black', fontSize: 10 }}
            numberOfTicks={5}
            formatLabel={(value) => Math.round(value)}
            style={{ marginRight: 30 }}
          />
          <View style={{ width: screenWidth * 0.5 }}>
            <View style={{ flex: 1 }}>
              <Grid
                direction="HORIZONTAL"
                svg={{ 
                  stroke: '#9e9e9e', 
                  strokeWidth: 1,
                  strokeDasharray: [4, 4]
                }}
                belowChart={true}
              />
              <BarChart
                style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                data={getDadosUltimosMeses()}
                svg={{ fill: '#2280b0' }}
                contentInset={{ top: 10, bottom: 10, left: 10, right: 10 }}
                spacing={0.2}
                gridMin={0}
                yAccessor={({ item }) => item.value}
              />
            </View>
            <XAxis
              data={getDadosUltimosMeses()}
              formatLabel={(value, index) => getDadosUltimosMeses()[index].label}
              contentInset={{ left: 10, right: 10 }}
              svg={{ 
                fill: 'black', 
                fontSize: 10,
                rotation: 45,
                originY: 0,
                y: 10
              }}
              style={{ marginTop: 10, height: 30 }}
              spacing={0.2}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Dashboard;
