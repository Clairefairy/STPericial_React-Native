import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function CustomHeader() {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuIcon}>
        <Icon name="menu" size={28} color="#fff" />
      </TouchableOpacity>
      <Image
        source={require("../../assets/STPericial_sem_fundo.png")}
        style={styles.headerLogo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    backgroundColor: "#357bd2",
    paddingHorizontal: 10,
    paddingTop: 100,
  },
  menuIcon: {
    position: 'absolute',
    left: 10,
    top: 110,
  },
  headerLogo: {
    width: 280,
    height: 90,
    marginBottom: 30,
  },
}); 