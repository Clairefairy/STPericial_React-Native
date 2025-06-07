import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import Dashboard from "../screens/Dashboard";
import Casos from "../screens/Casos";
import Laudos from "../screens/Laudos";
import RegistrosOdontologicos from "../screens/RegistrosOdontologicos";
import Vitimas from "../screens/Vitimas";
import GerenciarUsuarios from "../screens/GerenciarUsuarios";
import Perfil from "../screens/Perfil";

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#357bd2",
        },
        headerTintColor: "#fff",
        drawerStyle: {
          backgroundColor: "#fff",
        },
        drawerActiveTintColor: "#357bd2",
        drawerInactiveTintColor: "#000",
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="dashboard" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Casos"
        component={Casos}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="folder" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Laudos"
        component={Laudos}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="medical-services" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RegistrosOdontologicos"
        component={RegistrosOdontologicos}
        options={{
          title: "Registros Odontológicos",
          drawerIcon: ({ color }) => (
            <Icon name="medical-services" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Vitimas"
        component={Vitimas}
        options={{
          title: "Vítimas",
          drawerIcon: ({ color }) => (
            <FontAwesome6 name="person" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="GerenciarUsuarios"
        component={GerenciarUsuarios}
        options={{
          title: "Gerenciar Usuários",
          drawerIcon: ({ color }) => (
            <Icon name="people" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={Perfil}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="person" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Sair"
        component={Dashboard}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="exit-to-app" size={22} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: () => {
            navigation.navigate("Login");
          },
        }}
      />
    </Drawer.Navigator>
  );
} 