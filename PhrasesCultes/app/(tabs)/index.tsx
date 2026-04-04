import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, Pressable, StyleSheet, Switch, TextInput } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Quote, quotes } from '@/constants/phrasesCultes';
import { useThemeToggle } from '@/hooks/use-theme-toggle';

const STORAGE_KEY = 'user_quotes';
const RAINBOW = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
const EXPLOSION_EMOJIS = ['💥', '🔥', '💪', '👊', '⚡', '☠️', '🤯', '💣'];
const PARTICLE_COUNT = 16;

export default function HomeScreen() {
  const [allQuotes, setAllQuotes] = useState<Quote[]>(
    () => [...quotes].sort(() => Math.random() - 0.5)
  );
  const [quoteText, setQuoteText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeToggle();
  const wiggleAnim = useRef(new Animated.Value(0)).current;

  // Load saved user quotes on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) {
        const userQuotes: Quote[] = JSON.parse(stored);
        setAllQuotes((prev) => [...userQuotes, ...prev]);
      }
    });
  }, []);

  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const titleTapCount = useRef(0);
  const titleTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleTap = () => {
    titleTapCount.current += 1;
    if (titleTapTimer.current) clearTimeout(titleTapTimer.current);
    titleTapTimer.current = setTimeout(() => { titleTapCount.current = 0; }, 1500);
    if (titleTapCount.current >= 7) {
      titleTapCount.current = 0;
      setFlipped(true);
      Animated.timing(flipAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      setTimeout(() => {
        Animated.timing(flipAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => {
          setFlipped(false);
        });
      }, 3000);
    }
  };

  const [reversedIds, setReversedIds] = useState<Set<string>>(new Set());
  const toggleReversed = useCallback((id: string) => {
    setReversedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const [showConfetti, setShowConfetti] = useState(false);
  const confettiRef = useRef<ConfettiCannon | null>(null);

  // Explosion for Chuck Norris
  const [showExplosion, setShowExplosion] = useState(false);
  const explosionAnims = useRef(
    Array.from({ length: PARTICLE_COUNT }, () => ({
      progress: new Animated.Value(0),
      angle: Math.random() * Math.PI * 2,
    }))
  ).current;

  const triggerExplosion = () => {
    explosionAnims.forEach((p) => {
      p.angle = Math.random() * Math.PI * 2;
      p.progress.setValue(0);
    });
    setShowExplosion(true);
    Animated.stagger(
      30,
      explosionAnims.map((p) =>
        Animated.timing(p.progress, { toValue: 1, duration: 800, useNativeDriver: true })
      )
    ).start(() => setShowExplosion(false));
  };

  const handleAuthorPress = (author: string) => {
    if (author.toLowerCase().includes('dima')) {
      triggerWiggle();
    }
    if (author.toLowerCase().includes('roxane')) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const addQuote = () => {
    if (!quoteText.trim() || !authorName.trim()) return;
    let finalText = quoteText.trim();
    let finalAuthor = authorName.trim();
    if (finalText === '42') {
      finalText = 'La réponse à la grande question sur la vie, l\'univers et le reste.';
      finalAuthor = 'Deep Thought';
    }
    const newQuote: Quote = {
      id: Date.now().toString(),
      text: finalText,
      author: finalAuthor,
    };
    setAllQuotes((prev) => {
      const updated = [newQuote, ...prev];
      // Persist only user-added quotes (those not in the original list)
      const originalIds = new Set(quotes.map((q) => q.id));
      const userQuotes = updated.filter((q) => !originalIds.has(q.id));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userQuotes));
      return updated;
    });
    setQuoteText('');
    setAuthorName('');
    setFormOpen(false);
  };

   const [colorParty, setColorParty] = useState(false);
  const switchTapCount = useRef(0);
  const switchTapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorPartyIndex = useRef(new Animated.Value(0)).current;

  const handleSwitchChange = () => {
    switchTapCount.current += 1;
    if (switchTapTimer.current) clearTimeout(switchTapTimer.current);
    switchTapTimer.current = setTimeout(() => { switchTapCount.current = 0; }, 800);
    if (switchTapCount.current >= 3) {
      switchTapCount.current = 0;
      setColorParty(true);
      Animated.loop(
        Animated.timing(colorPartyIndex, { toValue: RAINBOW.length - 1, duration: 2000, useNativeDriver: false }),
        { iterations: 1 },
      ).start(() => {
        setColorParty(false);
        colorPartyIndex.setValue(0);
      });
    } else {
      toggleTheme();
    }
  };

  // Wiggle
  const triggerWiggle = () => {
    Animated.sequence([
      Animated.timing(wiggleAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: 5, duration: 50, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: -5, duration: 50, useNativeDriver: true }),
      Animated.timing(wiggleAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const flipRotation = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const partyBg = colorParty
    ? colorPartyIndex.interpolate({
        inputRange: RAINBOW.map((_, i) => i),
        outputRange: RAINBOW,
      })
    : undefined;

  const renderItem = ({ item }: { item: Quote }) => {
    const isReversed = reversedIds.has(item.id);
    const displayText = isReversed ? item.text.split('').reverse().join('') : item.text;

    if (colorParty) {
      return (
        <Animated.View style={[styles.quoteCard, { backgroundColor: partyBg }]}>
          <Pressable onLongPress={() => toggleReversed(item.id)} onPress={item.text.toLowerCase().includes('chuck norris') ? triggerExplosion : undefined}>
            <ThemedText style={styles.quoteText}>"{displayText}"</ThemedText>
          </Pressable>
          <Pressable onPress={() => handleAuthorPress(item.author)}>
            <ThemedText style={styles.quoteAuthor}>— {item.author}</ThemedText>
          </Pressable>
        </Animated.View>
      );
    }

    return (
      <ThemedView style={styles.quoteCard}>
        <Pressable onLongPress={() => toggleReversed(item.id)} onPress={item.text.toLowerCase().includes('chuck norris') ? triggerExplosion : undefined}>
          <ThemedText style={styles.quoteText}>"{displayText}"</ThemedText>
        </Pressable>
        <Pressable onPress={() => handleAuthorPress(item.author)}>
          <ThemedText style={styles.quoteAuthor}>— {item.author}</ThemedText>
        </Pressable>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Pressable onPress={handleTitleTap}>
          <ThemedText type="title">Phrases Cultes</ThemedText>
        </Pressable>
        <ThemedView style={{ alignItems: 'center' }}>
          <Switch value={isDark} onValueChange={handleSwitchChange} />
          <ThemedText style={{ fontSize: 12, opacity: 0.6 }}>{isDark ? 'Sombre' : 'Clair'}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.formWrapper}>
        <Collapsible title="Ajouter une phrase culte" isOpen={formOpen} onToggle={setFormOpen}>
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
            placeholder="La phrase..."
            placeholderTextColor="#999"
            value={quoteText}
            onChangeText={setQuoteText}
            multiline
          />
          <TextInput
            style={[styles.input, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Ton nom"
            placeholderTextColor="#999"
            value={authorName}
            onChangeText={setAuthorName}
          />
          <Pressable
            style={[styles.addButton, (!quoteText.trim() || !authorName.trim()) && styles.addButtonDisabled]}
            onPress={addQuote}
          >
            <ThemedText style={styles.addButtonText}>Ajouter</ThemedText>
          </Pressable>
        </Collapsible>
      </ThemedView>
      <Animated.View style={{ flex: 1, transform: [{ translateX: wiggleAnim }, { rotate: flipped ? flipRotation : '0deg' }] }}>
        <FlatList
          data={allQuotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </Animated.View>
      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={150}
          origin={{ x: 200, y: 0 }}
          autoStart
          fadeOut
          fallSpeed={3000}
        />
      )}
      {showExplosion && (
        <ThemedView style={styles.explosionContainer} pointerEvents="none">
          {explosionAnims.map((p, i) => {
            const { width, height } = Dimensions.get('window');
            const radius = Math.max(width, height) * 0.5;
            const translateX = p.progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(p.angle) * radius] });
            const translateY = p.progress.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(p.angle) * radius] });
            const scale = p.progress.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 2, 0.5] });
            const opacity = p.progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 0] });
            return (
              <Animated.Text
                key={i}
                style={[styles.particle, { opacity, transform: [{ translateX }, { translateY }, { scale }] }]}
              >
                {EXPLOSION_EMOJIS[i % EXPLOSION_EMOJIS.length]}
              </Animated.Text>
            );
          })}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  formWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    fontSize: 14,
  },
  addButton: {
    marginTop: 10,
    backgroundColor: '#0a7ea4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  quoteCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  quoteText: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  quoteSource: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  explosionContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  particle: {
    position: 'absolute',
    fontSize: 28,
  },
});
