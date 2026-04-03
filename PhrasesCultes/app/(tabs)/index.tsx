import { FlatList, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Quote, quotes } from '@/constants/phrasesCultes';

export default function HomeScreen() {
  const renderItem = ({ item }: { item: Quote }) => (
    <ThemedView style={styles.quoteCard}>
      <ThemedText style={styles.quoteText}>"{item.text}"</ThemedText>
      <ThemedText style={styles.quoteAuthor}>— {item.author}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Phrases Cultes</ThemedText>
      <FlatList
        data={quotes}
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
