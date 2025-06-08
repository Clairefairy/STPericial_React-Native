import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { PieChart, BarChart } from "react-native-chart-kit";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const casosMock = [
  { data: "2024-05-12", status: "arquivado" },
  { data: "2024-05-20", status: "em_andamento" },
  { data: "2024-05-14", status: "finalizado" },
  { data: "2024-05-15", status: "em_andamento" },
  { data: "2024-05-28", status: "arquivado" },
  { data: "2024-05-05", status: "finalizado" },
  { data: "2024-05-06", status: "arquivado" },
  { data: "2024-05-08", status: "em_andamento" },
  { data: "2024-05-09", status: "em_andamento" },
];

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date("2024-05-01"));
  const [endDate, setEndDate] = useState(new Date("2024-05-31"));
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [status, setStatus] = useState("todos");

  const filteredCasos = casosMock.filter((caso) => {
    const dataCaso = new Date(caso.data);
    const dentroDoPeriodo = dataCaso >= startDate && dataCaso <= endDate;
    const statusOk = status === "todos" || caso.status === status;
    return dentroDoPeriodo && statusOk;
  });

  const statusCounts = {
    arquivado: 0,
    em_andamento: 0,
    finalizado: 0,
  };

  filteredCasos.forEach((caso) => {
    if (statusCounts[caso.status] !== undefined) {
      statusCounts[caso.status]++;
    }
  });

  const pieData = [
    {
      name: "Arquivado",
      count: statusCounts.arquivado,
      color: "#6c5ce7",
      legendFontColor: "#444",
      legendFontSize: 14,
    },
    {
      name: "Em andamento",
      count: statusCounts.em_andamento,
      color: "#00b894",
      legendFontColor: "#444",
      legendFontSize: 14,
    },
    {
      name: "Finalizado",
      count: statusCounts.finalizado,
      color: "#fdcb6e",
      legendFontColor: "#444",
      legendFontSize: 14,
    },
  ];

  const groupedPorData = filteredCasos.reduce((acc, caso) => {
    acc[caso.data] = (acc[caso.data] || 0) + 1;
    return acc;
  }, {});

  const barData = {
    labels: Object.keys(groupedPorData),
    datasets: [{ data: Object.values(groupedPorData) }],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
    labelColor: () => "#000",
    barPercentage: 0.6,
  };

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
            onPress={() => setShowStart(true)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="calendar-outline" size={18} color="#2d3436" />
            <Text style={{ marginLeft: 5 }}>
              Início: {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEnd(true)}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="calendar-outline" size={18} color="#2d3436" />
            <Text style={{ marginLeft: 5 }}>
              Fim: {endDate.toLocaleDateString()}
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
              if (date) setStartDate(date);
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
              if (date) setEndDate(date);
            }}
          />
        )}

        {/* Picker de status */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ marginBottom: 5 }}>Status:</Text>
          <View
            style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 8 }}
          >
            <Picker
              selectedValue={status}
              onValueChange={(item) => setStatus(item)}
              style={{ height: 50 }}
            >
              <Picker.Item label="Todos" value="todos" />
              <Picker.Item label="Arquivado" value="arquivado" />
              <Picker.Item label="Em andamento" value="em_andamento" />
              <Picker.Item label="Finalizado" value="finalizado" />
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
          Distribuição por Status
        </Text>
        <PieChart
          data={pieData}
          width={screenWidth - 50}
          height={200}
          chartConfig={chartConfig}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="8" // ESPAÇO PARA MELHOR VISUALIZAÇÃO GRÁFICO DE PIZZA E TEXTO
          absolute
        />
      </View>

      {/* Gráfico de barras */}
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 15,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10 }}>
          Casos por Data
        </Text>
        <BarChart
          data={barData}
          width={screenWidth - 50}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          fromZero
          showValuesOnTopOfBars
        />
      </View>
    </ScrollView>
  );
};

export default Dashboard;
