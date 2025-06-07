import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

import DrawerRoutes from '../../routes/drawer.routes'; // Importa o Drawer Navigator
import AdicionarCaso from '../../screens/AdicionarCaso'; // Importa a tela AdicionarCaso
import Favoritos from '../../screens/Favoritos';

const Tab = createBottomTabNavigator();

// Componente personalizado para o botão central 'Adicionar'
const CustomPlusButton = ({ children }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        top: -15,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => navigation.navigate('AdicionarCaso')}
    >
      <View style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#357bd2',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children}
      </View>
    </TouchableOpacity>
  );
};

const CustomHomeButton = ({ children }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      onPress={() => navigation.navigate('HomeTab', { screen: 'Dashboard' })}
    >
      {children}
    </TouchableOpacity>
  );
};

export default function CustomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false, // Oculta os rótulos das abas
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 15,
          height: 90,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab" // Esta será a Dashboard acessível via Drawer
        component={DrawerRoutes} // Drawer Navigator para Home/Dashboard
        options={{
          headerShown: false, // Oculta o cabeçalho, pois o drawer já o trata
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <Ionicons name="home-outline" size={25} color={focused ? '#357bd2' : '#748c94'} />
            </View>
          ),
          tabBarButton: (props) => (
            <CustomHomeButton {...props} />
          )
        }}
      />
      <Tab.Screen
        name="AdicionarCaso"
        component={AdicionarCaso}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesome5 name="plus-square" size={28} color="#fff" />
          ),
          tabBarButton: (props) => (
            <CustomPlusButton {...props} />
          )
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favoritos}
        options={{
          headerShown: false, // Oculta o cabeçalho para esta tela de placeholder
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 10 }}>
              <AntDesign name="staro" size={25} color={focused ? '#357bd2' : '#748c94'} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
}); 