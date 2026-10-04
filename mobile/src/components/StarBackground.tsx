import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MysticColors, Gradients } from '../theme/colors';

const { width, height } = Dimensions.get('window');

interface StarProps {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

export const StarBackground: React.FC<{ children: React.ReactNode; style?: any }> = ({
  children,
  style,
}) => {
  // Generate a deterministic mystical star field
  const stars: StarProps[] = useMemo(() => {
    const list: StarProps[] = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      list.push({
        x: (i * 97) % width,
        y: (i * 131) % height,
        size: (i % 3) + 1,
        opacity: 0.25 + ((i % 5) * 0.15),
      });
    }
    return list;
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Deep cosmic gradient */}
      <LinearGradient
        colors={Gradients.mysticVoid}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle purple nebula glow overlay */}
      <View style={styles.nebulaGlow} />

      {/* Star field */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {stars.map((star, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: star.x,
                top: star.y,
                width: star.size,
                height: star.size,
                borderRadius: star.size / 2,
                opacity: star.opacity,
              },
            ]}
          />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MysticColors.bgVoid,
  },
  nebulaGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(123, 44, 191, 0.18)',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    shadowColor: MysticColors.purpleLight,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
  },
});
