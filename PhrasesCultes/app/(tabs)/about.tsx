import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CHAR_SIZE = 16;
const COLUMNS = Math.floor(SCREEN_WIDTH / CHAR_SIZE);
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

function MatrixColumn({ index }: { index: number }) {
  const translateY = useRef(new Animated.Value(-SCREEN_HEIGHT * Math.random())).current;
  const duration = 2000 + Math.random() * 4000;
  const chars = useMemo(
    () =>
      Array.from({ length: Math.floor(SCREEN_HEIGHT / CHAR_SIZE) }, () =>
        MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
      ),
    []
  );

  useEffect(() => {
    const animate = () => {
      translateY.setValue(-SCREEN_HEIGHT);
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration,
        useNativeDriver: true,
      }).start(() => animate());
    };
    // stagger initial start
    const timeout = setTimeout(animate, Math.random() * 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: index * CHAR_SIZE,
        top: 0,
        transform: [{ translateY }],
      }}
    >
      {chars.map((char, i) => (
        <View key={i} style={{ height: CHAR_SIZE, justifyContent: 'center' }}>
          <Animated.Text
            style={{
              color: i === chars.length - 1 ? '#fff' : `rgba(0,255,70,${1 - i / chars.length})`,
              fontSize: CHAR_SIZE - 2,
              fontFamily: 'monospace',
            }}
          >
            {char}
          </Animated.Text>
        </View>
      ))}
    </Animated.View>
  );
}

function MatrixRain() {
  const columns = useMemo(
    () => Array.from({ length: COLUMNS }, (_, i) => i),
    []
  );
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {columns.map((i) => (
        <MatrixColumn key={i} index={i} />
      ))}
    </View>
  );
}

export default function AboutScreen() {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <MatrixRain />
      <View style={styles.content}>
        <Animated.View style={[styles.imagePlaceholder, { transform: [{ scale: scaleAnim }] }]}>
          <Image
            source={require('@/assets/images/CESI_logo.jpg')}
            style={{ width: 200, height: 200, borderRadius: 10, margin: 10 }}
          />
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <ThemedText style={styles.text}>Application fièrement produite par l'équipe des Bosseurs de CDA 25 (CESI) & Dima</ThemedText>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#0f0',
  },
});
