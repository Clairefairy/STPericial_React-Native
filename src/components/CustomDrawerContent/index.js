import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 150 }}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
} 