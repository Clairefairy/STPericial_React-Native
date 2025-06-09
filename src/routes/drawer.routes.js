import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import Dashboard from "../screens/Dashboard";
import Casos from "../screens/Casos";
import Laudos from "../screens/Laudos";
import RegistrosOdontologicos from "../screens/RegistrosOdontologicos";
import Vitimas from "../screens/Vitimas";
import GerenciarUsuarios from "../screens/GerenciarUsuarios";
import Perfil from "../screens/Perfil";

import CustomHeader from "../components/CustomHeader";
import CustomDrawerContent from "../components/CustomDrawerContent";

const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: handleLogout,
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        header: ({ route }) => {
          if (route.name === "Sair") {
            return null; 
          }
          return <CustomHeader />;
        },
        drawerStyle: {
          backgroundColor: "#fff",
        },
        drawerActiveTintColor: "#357bd2",
        drawerInactiveTintColor: "#000",
      })}
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
            <Icon name="description" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="RegistrosOdontologicos"
        component={RegistrosOdontologicos}
        options={{
          title: "Registros Odontológicos",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="tooth" size={22} color={color} />
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
          drawerItemPress: (e) => {
            e.preventDefault();
            confirmLogout();
          },
        }}
      />
    </Drawer.Navigator>
  );
} 