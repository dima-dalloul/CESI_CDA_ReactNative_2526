import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput } from 'react-native';

import { Collapsible } from '@/components/ui/collapsible';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Quote, quotes } from '@/constants/phrasesCultes';

export default function HomeScreen() {
  const [allQuotes, setAllQuotes] = useState<Quote[]>(
    () => [...quotes].sort(() => Math.random() - 0.5)
  );
  const [quoteText, setQuoteText] = useState('');
  const [authorName, setAuthorName] = useState('');

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
  };

  const renderItem = ({ item }: { item: Quote }) => (
    <ThemedView style={styles.quoteCard}>
      <ThemedText style={styles.quoteText}>"{item.text}"</ThemedText>
      <ThemedText style={styles.quoteAuthor}>— {item.author}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Phrases Cultes</ThemedText>
      <ThemedView style={styles.formWrapper}>
        <Collapsible title="Ajouter une phrase">
          <TextInput
            style={styles.input}
            placeholder="La phrase..."
            placeholderTextColor="#999"
            value={quoteText}
            onChangeText={setQuoteText}
            multiline
          />
          <TextInput
            style={styles.input}
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
      <FlatList
        data={allQuotes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
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
    color: '#fff',
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
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },
  quoteSource: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
});
