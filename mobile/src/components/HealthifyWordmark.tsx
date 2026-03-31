import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { fonts, colors } from '../theme';

interface Props {
  size?: 'large' | 'medium';
  light?: boolean;
}

function LeafDot({ pxSize, light }: { pxSize: number; light?: boolean }) {
  const fill = light ? '#a8e6c0' : colors.green;
  return (
    <Svg width={pxSize} height={pxSize} viewBox="0 0 20 20">
      <Path
        d="M10 18 C10 18 2 12 3 5 C4 1 10 1 10 1 C10 1 16 1 17 5 C18 12 10 18 10 18 Z"
        fill={fill}
      />
      <Path d="M10 17 L10 3" stroke="#fff" strokeWidth={1.5} opacity={0.5} />
    </Svg>
  );
}

export default function HealthifyWordmark({ size = 'large', light = false }: Props) {
  const fontSize = size === 'large' ? 42 : 28;
  const leafPx = size === 'large' ? 16 : 11;
  const textColor = light ? '#fff' : colors.green;
  const coverBg = light ? colors.greenDark : colors.white;
  const dotTop = size === 'large' ? 7 : 5;
  const coverW = leafPx + 6;

  return (
    <View style={styles.row}>
      <Text style={[styles.text, { fontSize, color: textColor }]}>Health</Text>

      {/* "i" with original dot hidden and leaf replacing it */}
      <View style={styles.iWrapper}>
        <Text style={[styles.text, { fontSize, color: textColor }]}>i</Text>

        {/* Cover the original font dot */}
        <View
          style={{
            position: 'absolute',
            top: dotTop,
            alignSelf: 'center',
            width: coverW,
            height: leafPx + 4,
            backgroundColor: coverBg,
            zIndex: 1,
          }}
        />

        {/* Leaf replaces the dot */}
        <View style={{ position: 'absolute', top: dotTop, alignSelf: 'center', zIndex: 2 }}>
          <LeafDot pxSize={leafPx} light={light} />
        </View>
      </View>

      <Text style={[styles.text, { fontSize, color: textColor }]}>fy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  text: {
    fontFamily: fonts.pacifico,
    includeFontPadding: false,
  },
  iWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
});
