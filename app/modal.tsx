import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import React from 'react';

import { ScreenContent } from '~/components/ScreenContent';

export default function Modal() {
  return (
    <>
      <ScreenContent path="app/modal.tsx" title="Modal" />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </>
  );
}
