import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { Header } from '../components/Header';
import { MysticButton } from '../components/MysticButton';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { TarotReading } from '../types/tarot';
import { MysticColors } from '../theme/colors';

interface HistoryScreenProps {
  onSelectReading: (reading: TarotReading) => void;
  onNavigateToAsk: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  onSelectReading,
  onNavigateToAsk,
}) => {
  const { user } = useAuth();
  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSpread, setFilterSpread] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const data = await StorageService.getReadings(user?.uid || 'guest');
    setReadings(data);
    setLoading(false);
  }, [user?.uid]);

  useEffect(() => {
    let isMounted = true;
    StorageService.getReadings(user?.uid || 'guest').then((data) => {
      if (isMounted) {
        setReadings(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleDelete = (reading: TarotReading) => {
    Alert.alert(
      'Excluir Leitura',
      'Deseja remover esta tiragem do seu histórico místico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteReading(reading.userId, reading.id);
            setReadings((prev) => prev.filter((r) => r.id !== reading.id));
          },
        },
      ]
    );
  };

  const filteredReadings = readings.filter((r) => {
    const matchesSearch =
      r.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cards.some((c) => c.card.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filterSpread === 'all' || r.spreadType === filterSpread;
    return matchesSearch && matchesFilter;
  });

  const renderReadingItem = ({ item }: { item: TarotReading }) => {
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onSelectReading(item)}
        style={styles.cardContainer}
      >
        <LinearGradient
          colors={['#25124A', '#130926']}
          style={styles.cardGradient}
        >
          {/* Header row */}
          <View style={styles.cardHeader}>
            <View style={styles.badgeRow}>
              <View style={styles.spreadBadge}>
                <Text style={styles.spreadBadgeText}>{item.spreadTitle}</Text>
              </View>
              <Text style={styles.dateText}>{dateFormatted}</Text>
            </View>

            <TouchableOpacity
              onPress={() => handleDelete(item)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={MysticColors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Question */}
          <Text style={styles.questionText} numberOfLines={2}>
            {`"${item.question}"`}
          </Text>

          {/* Cards Thumbnails Row */}
          <View style={styles.cardsRow}>
            {item.cards.map((dc, i) => (
              <View key={i} style={styles.cardThumbItem}>
                <Image
                  source={{ uri: dc.card.imageUrl }}
                  style={[
                    styles.cardThumbImage,
                    dc.isReversed && styles.reversedThumb,
                  ]}
                  resizeMode="cover"
                />
                <Text style={styles.cardThumbName} numberOfLines={1}>
                  {dc.card.name.split(' ')[0]}
                </Text>
              </View>
            ))}
          </View>

          {/* Footer Vibe */}
          <View style={styles.cardFooter}>
            <Text style={styles.energyVibeText} numberOfLines={1}>
              {item.interpretation.energyVibe}
            </Text>
            <View style={styles.viewDetailLink}>
              <Text style={styles.viewDetailText}>Ver leitura</Text>
              <Ionicons name="chevron-forward" size={14} color={MysticColors.gold} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <StarBackground>
      <Header title="Histórico de Tiragens" subtitle="Suas conexões com o oráculo" />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={MysticColors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por pergunta ou carta..."
          placeholderTextColor={MysticColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color={MysticColors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterScrollWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { id: 'all', label: 'Todas' },
            { id: 'one_card', label: '1 Carta' },
            { id: 'three_cards', label: '3 Cartas' },
            { id: 'love', label: 'Amor' },
            { id: 'career', label: 'Carreira' },
            { id: 'celtic_cross', label: 'Cruz Mística' },
          ]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = filterSpread === item.id;
            return (
              <TouchableOpacity
                onPress={() => setFilterSpread(item.id)}
                style={[
                  styles.filterTab,
                  isSelected && styles.filterTabSelected,
                ]}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    isSelected && styles.filterTabTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.filterList}
        />
      </View>

      {/* History List */}
      <FlatList
        data={filteredReadings}
        keyExtractor={(item) => item.id}
        renderItem={renderReadingItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MysticColors.purpleLight}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="moon-outline" size={48} color={MysticColors.purpleMedium} />
              <Text style={styles.emptyTitle}>Nenhuma Tiragem Encontrada</Text>
              <Text style={styles.emptySub}>
                O universo aguarda suas perguntas. Faça uma tiragem para registrar seus caminhos espirituais.
              </Text>
              <MysticButton
                title="Consultar o Oráculo Agora"
                variant="gold"
                size="md"
                icon="sparkles"
                onPress={onNavigateToAsk}
                style={{ marginTop: 16 }}
              />
            </View>
          ) : null
        }
      />
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  filterScrollWrapper: {
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(35, 18, 77, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(157, 101, 232, 0.2)',
  },
  filterTabSelected: {
    backgroundColor: MysticColors.purpleDeep,
    borderColor: MysticColors.gold,
  },
  filterTabText: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTabTextSelected: {
    color: MysticColors.goldLight,
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 110,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 12,
  },
  cardGradient: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spreadBadge: {
    backgroundColor: 'rgba(157, 101, 232, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  spreadBadgeText: {
    color: MysticColors.goldLight,
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    color: MysticColors.textMuted,
    fontSize: 11,
  },
  questionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  cardThumbItem: {
    alignItems: 'center',
  },
  cardThumbImage: {
    width: 38,
    height: 60,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: MysticColors.borderGlow,
    backgroundColor: '#000',
  },
  reversedThumb: {
    transform: [{ rotate: '180deg' }],
  },
  cardThumbName: {
    color: MysticColors.textSecondary,
    fontSize: 9,
    marginTop: 2,
    maxWidth: 42,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(157, 101, 232, 0.15)',
    paddingTop: 8,
  },
  energyVibeText: {
    color: MysticColors.purpleLight,
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  viewDetailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailText: {
    color: MysticColors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    color: MysticColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySub: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
