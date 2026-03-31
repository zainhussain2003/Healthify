import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {fonts, colors} from '../theme';

interface Props {
  size?: 'large' | 'medium';
  light?: boolean; // white text for dark backgrounds
}

/** Tiny leaf SVG to sit above the dot of the "i" */
function LeafDot({size, light}: {size: number; light?: boolean}) {
  const fill = light ? '#a8e6c0' : colors.green;
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Path
        d="M10 18 C10 18 2 12 3 5 C4 1 10 1 10 1 C10 1 16 1 17 5 C18 12 10 18 10 18 Z"
        fill={fill}
      />
      <Path d="M10 17 L10 3" stroke="#fff" strokeWidth={1.5} opacity={0.5} />
    </Svg>
  );
}

export default function HealthifyWordmark({size = 'large', light = false}: Props) {
  const fontSize = size === 'large' ? 42 : 28;
  const leafSize = size === 'large' ? 13 : 9;
  // Offset to place leaf over the dot of "i" (between "Health" and "fy")
  const leafTop = size === 'large' ? -2 : -1;
  const textColor = light ? '#fff' : colors.green;

  return (
    <View style={styles.row}>
      {/* "Health" */}
      <Text style={[styles.text, {fontSize, color: textColor}]}>Health</Text>

      {/* "i" with leaf replacing its dot */}
      <View style={styles.iWrapper}>
        {/* The "i" body only — we hide the dot via a covering View, then overlay the leaf */}
        <Text style={[styles.text, {fontSize, color: textColor}]}>i</Text>
        {/* Leaf overlay on the dot position */}
        <View style={[styles.leafOverlay, {top: leafTop}]}>
          <LeafDot size={leafSize} light={light} />
        </View>
      </View>

      {/* "fy" */}
      <Text style={[styles.text, {fontSize, color: textColor}]}>fy</Text>
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
  leafOverlay: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
