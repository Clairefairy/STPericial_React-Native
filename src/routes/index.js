import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerRoutes from "./drawer.routes";

// IMPORTANTO AS SCREENS
import Home from "../screens/BemVindo";
import Login from "../screens/Login";
import Bemvindo from "../screens/BemVindo";
import Cadastro from "../screens/Cadastro";

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
        component={DrawerRoutes}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
