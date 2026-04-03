import { useRef, useState } from 'react';
import { Animated, FlatList, Pressable, StyleSheet, Switch, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Quote, quotes } from '@/constants/phrasesCultes';
import { useThemeToggle } from '@/hooks/use-theme-toggle';

export default function HomeScreen() {
  const [allQuotes, setAllQuotes] = useState<Quote[]>(
    () => [...quotes].sort(() => Math.random() - 0.5)
  );
  const [quoteText, setQuoteText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const { isDark, toggleTheme } = useThemeToggle();
  const wiggleAnim = useRef(new Animated.Value(0)).current;

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

  const addQuote = () => {
    if (!quoteText.trim() || !authorName.trim()) return;
    const newQuote: Quote = {
      id: Date.now().toString(),
      text: quoteText.trim(),
      author: authorName.trim(),
    };
    setAllQuotes((prev) => [newQuote, ...prev]);
    setQuoteText('');
    setAuthorName('');
    setFormOpen(false);
  };

  const renderItem = ({ item }: { item: Quote }) => (
    <ThemedView style={styles.quoteCard}>
      <ThemedText style={styles.quoteText}>"{item.text}"</ThemedText>
      <Pressable onPress={item.author.toLowerCase().includes('dima') ? triggerWiggle : undefined}>
        <ThemedText style={styles.quoteAuthor}>— {item.author}</ThemedText>
      </Pressable>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Phrases Cultes</ThemedText>
        <ThemedView style={{ alignItems: 'center' }}>
          <Switch value={isDark} onValueChange={toggleTheme} />
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
      <Animated.View style={{ flex: 1, transform: [{ translateX: wiggleAnim }] }}>
        <FlatList
          data={allQuotes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </Animated.View>
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
});
