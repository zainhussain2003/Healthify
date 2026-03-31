import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors, fonts} from '../theme';
import HealthifyWordmark from './HealthifyWordmark';

interface Props {
  onBack?: () => void;
}

export default function ScreenHeader({onBack}: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.back} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <HealthifyWordmark size="medium" light />
      <View style={styles.backPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.greenDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  back: {
    width: 36,
    alignItems: 'flex-start',
  },
  backArrow: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
  },
  backPlaceholder: {
    width: 36,
  },
});
