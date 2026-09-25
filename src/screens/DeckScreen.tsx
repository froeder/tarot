import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { Header } from '../components/Header';
import { TarotCardView } from '../components/TarotCardView';
import { CardDetailModal } from '../components/CardDetailModal';
import { TAROT_DECK, MAJOR_ARCANA, MINOR_ARCANA } from '../data/tarotCards';
import { TarotCard } from '../types/tarot';
import { MysticColors } from '../theme/colors';

interface DeckScreenProps {
  onBack?: () => void;
}

export const DeckScreen: React.FC<DeckScreenProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);

  const filters = [
    { id: 'all', label: 'Todos (78)' },
    { id: 'major', label: 'Arcanos Maiores (22)' },
    { id: 'wands', label: 'Paus 🔥' },
    { id: 'cups', label: 'Copas 💧' },
    { id: 'swords', label: 'Espadas 🌪️' },
    { id: 'pentacles', label: 'Ouros 🌍' },
  ];

  const filteredCards = TAROT_DECK.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));

    let matchesFilter = true;
    if (filterType === 'major') matchesFilter = c.type === 'major';
    else if (filterType === 'wands') matchesFilter = c.suit === 'wands';
    else if (filterType === 'cups') matchesFilter = c.suit === 'cups';
    else if (filterType === 'swords') matchesFilter = c.suit === 'swords';
    else if (filterType === 'pentacles') matchesFilter = c.suit === 'pentacles';

    return matchesSearch && matchesFilter;
  });

  return (
    <StarBackground>
      <Header
        title="Guia dos Arcanos"
        subtitle="Enciclopédia de Simbologia e Sabedoria"
        showBack={!!onBack}
        onBack={onBack}
      />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={MysticColors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar carta, naipe ou palavra-chave..."
          placeholderTextColor={MysticColors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={MysticColors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filtersWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = filterType === item.id;
            return (
              <TouchableOpacity
                onPress={() => setFilterType(item.id)}
                style={[
                  styles.filterTab,
                  isSelected && styles.filterTabSelected,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.filtersContent}
        />
      </View>

      {/* Cards Grid */}
      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <TarotCardView
              card={item}
              size="sm"
              isRevealed={true}
              onPress={() => setSelectedCard(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={40} color={MysticColors.textMuted} />
            <Text style={styles.emptyText}>Nenhuma carta encontrada.</Text>
          </View>
        }
      />

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        isReversed={false}
        visible={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 12, 51, 0.85)',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  filtersWrapper: {
    marginBottom: 8,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(35, 18, 77, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(157, 101, 232, 0.2)',
  },
  filterTabSelected: {
    backgroundColor: MysticColors.purpleDeep,
    borderColor: MysticColors.gold,
  },
  filterText: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: MysticColors.goldLight,
    fontWeight: '700',
  },
  gridContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 110,
    alignItems: 'center',
  },
  gridItem: {
    margin: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: MysticColors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
});
