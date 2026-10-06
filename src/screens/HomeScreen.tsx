import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Card, Checkbox, IconButton, Text } from 'react-native-paper';

import { NewReminder } from '../../types';
import AddItemButton from '../components/AddItemButton';
import ReminderModal from '../components/ReminderModal';
import StatsBar from '../components/StatsBar';
import { useGroceryList } from '../hooks/useGroceryList';
import { useNotifications } from '../hooks/useNotifications';

export default function HomeScreen({ navigation }: any) {
  const [reminderModalVisible, setReminderModalVisible] = useState(false);

  const { items, loading, loadItems, addItem, toggleItem, deleteItem, clearPurchased } =
    useGroceryList();

  const { addReminder } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="bell-outline"
          iconColor="#FFF"
          size={24}
          onPress={() => setReminderModalVisible(true)}
        />
      ),
    });
  }, [navigation]);

  const handleSaveReminder = async (data: NewReminder) => {
    await addReminder(data);
  };

  const hasPurchasedItems = items.some((item) => item.completed);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatsBar items={items} />

      {hasPurchasedItems && (
        <TouchableOpacity style={styles.clearBtn} onPress={clearPurchased} activeOpacity={0.7}>
          <Text style={styles.clearBtnText}>Limpiar productos comprados</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Presiona "+" para agregar un producto</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.row}>
              <Checkbox
                status={item.completed ? 'checked' : 'unchecked'}
                color="#8A2BE2"
                onPress={() => toggleItem(item.id)}
              />
              <Text style={[styles.title, item.completed && styles.titleCompleted]}>
                {item.name}
              </Text>
              <IconButton
                icon="delete-outline"
                iconColor="#D32F2F"
                size={24}
                onPress={() => deleteItem(item.id)}
              />
            </View>
          </Card>
        )}
      />

      <View style={styles.fabContainer}>
        <AddItemButton onPress={() => navigation.navigate('CreateItem')} />
      </View>

      <ReminderModal
        visible={reminderModalVisible}
        onClose={() => setReminderModalVisible(false)}
        onSave={handleSaveReminder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtn: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 8,
  },
  clearBtnText: {
    color: '#8A2BE2',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#888888',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666666',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});