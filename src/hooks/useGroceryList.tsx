import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { GroceryItem } from "../../types";

const STORAGE_KEY = "@grocery_list";

export function useGroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setItems(JSON.parse(stored));
      } else {
        setItems([]);
      }
    } catch (e) {
      setError("Error al cargar los productos.");
      console.error("AsyncStorage getItem error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const saveItems = async (updatedItems: GroceryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (e) {
      setError("Error al guardar los productos.");
      console.error("AsyncStorage setItem error:", e);
    }
  };

  const addItem = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;

      const newItem: GroceryItem = {
        id: Date.now().toString(),
        name: trimmed,
        completed: false,
        createdAt: Date.now(),
      };

      const updated = [newItem, ...items];
      setItems(updated);
      await saveItems(updated);
    },
    [items]
  );

  const toggleItem = useCallback(
    async (id: string) => {
      const updated = items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      setItems(updated);
      await saveItems(updated);
    },
    [items]
  );

  const deleteItem = useCallback(
    async (id: string) => {
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);
      await saveItems(updated);
    },
    [items]
  );

  const clearPurchased = useCallback(async () => {
    const updated = items.filter((item) => !item.completed);
    setItems(updated);
    await saveItems(updated);
  }, [items]);

  return {
    items,
    loading,
    error,
    loadItems,
    addItem,
    toggleItem,
    deleteItem,
    clearPurchased,
  };
}