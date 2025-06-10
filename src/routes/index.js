import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomTabNavigator from "../components/CustomTabNavigator";

// IMPORTANTO AS SCREENS
import Home from "../screens/BemVindo";
import Login from "../screens/Login";
import Bemvindo from "../screens/BemVindo";
import Cadastro from "../screens/Cadastro";
import DetalhesCaso from "../screens/DetalhesCaso";
import EditarCaso from "../screens/EditarCaso";

const Stack = createNativeStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        //ADICIONANANDO PROPRIEDADES
        name="Bem-vindo"
        component={Bemvindo}
        options={{
          headerShown: false, // ESSE COMANDO IRÁ ESCONDER O CABEÇALHO PADRÃO
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false, // ESSE COMANDO IRÁ ESCONDER O CABEÇALHO PADRÃO
        }}
      />
      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{
          headerShown: false, // ESSE COMANDO IRÁ ESCONDER O CABEÇALHO PADRÃO
        }}
      />
      <Stack.Screen
        name="MainApp"
        component={CustomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetalhesCaso"
        component={DetalhesCaso}
        options={{
          title: "Detalhes do Caso",
          headerStyle: {
            backgroundColor: "#357bd2",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="EditarCaso"
        component={EditarCaso}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
