import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import type { EventSubscription } from 'expo-modules-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';

import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { getPermissionsAsync, requestPermissionsAsync } from 'expo-notifications/build/NotificationPermissions';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { addNotificationReceivedListener } from 'expo-notifications/build/NotificationsEmitter';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';

import { NewReminder, PermissionStatus, Reminder } from '../../types';

const STORAGE_KEY = '@shopping_reminder';

try {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (e) {
  console.warn('[Reminders] No se pudo configurar el handler de notificaciones:', e);
}

interface UseNotificationsReturn {
  permissionStatus: PermissionStatus;
  loading: boolean;
  requestPermission: () => Promise<void>;
  addReminder: (data: NewReminder) => Promise<void>;
}

export function useNotifications(): UseNotificationsReturn {
  const [, setReminders] = useState<Reminder[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('idle');
  const [loading, setLoading] = useState<boolean>(true);

  const notificationListener = useRef<EventSubscription | null>(null);

  const persistReminders = useCallback(async (list: Reminder[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (error) {
      console.error('[Reminders] Error guardando:', error);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    setPermissionStatus('loading');

    if (!Device.isDevice) {
      console.warn('[Reminders] Emulador detectado. Las notificaciones nativas pueden no sonar.');
    }

    if (Platform.OS === 'android') {
      try {
        await setNotificationChannelAsync('default', {
          name: 'Recordatorios',
          importance: AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#8A2BE2',
          sound: 'default',
        });
      } catch (err) {
        console.warn('[Reminders] No se pudo crear el canal Android:', err);
      }
    }

    try {
      const existingPermission = await getPermissionsAsync();
      let finalStatus = existingPermission.status;
      let canAskAgain = existingPermission.canAskAgain;

      if (existingPermission.status !== 'granted') {
        const requestedPermission = await requestPermissionsAsync({
          android: {},
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = requestedPermission.status;
        canAskAgain = requestedPermission.canAskAgain;
      }

      setPermissionStatus(finalStatus === 'granted' ? 'granted' : 'denied');

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permisos de notificación desactivados',
          canAskAgain
            ? 'Android no concedió el permiso. Toca nuevamente o habilita las notificaciones en la configuración.'
            : 'Las notificaciones fueron denegadas anteriormente. Habilítalas manualmente en los Ajustes del dispositivo.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (err) {
      console.warn('[Reminders] Error solicitando permisos:', err);
      setPermissionStatus('denied');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const rawData = await AsyncStorage.getItem(STORAGE_KEY);
        if (rawData) {
          const storedReminders: Reminder[] = JSON.parse(rawData);
          const now = Date.now();
          const activeReminders = storedReminders.map((item) => {
            if (!item.completed && item.scheduledDate < now) {
              return { ...item, notificationId: null };
            }
            return item;
          });
          setReminders(activeReminders);
        }
      } catch (error) {
        console.error('[Reminders] Error al restaurar recordatorios:', error);
      } finally {
        setLoading(false);
      }
    };

    init();

    try {
      notificationListener.current = addNotificationReceivedListener((notification) => {
        const notifId = notification.request.identifier;
        setReminders((prev) =>
          prev.map((r) =>
            r.notificationId === notifId ? { ...r, notificationId: null } : r
          )
        );
      });
    } catch (e) {
      console.warn('[Reminders] Listener de notificaciones no disponible:', e);
    }

    return () => {
      notificationListener.current?.remove();
    };
  }, []);

  const addReminder = useCallback(
    async ({ title, description, scheduledDate }: NewReminder) => {
      if (permissionStatus !== 'granted') {
        await requestPermission();
      }

      const triggerSeconds = Math.max(
        1,
        Math.floor((scheduledDate.getTime() - Date.now()) / 1000)
      );

      let notificationId: string | null = null;

      try {
        notificationId = await scheduleNotificationAsync({
          content: {
            title: `🛒 Recordatorio: ${title}`,
            body: description || 'Es hora de revisar tu lista de compras',
            sound: 'default',
            data: { tipo: 'recordatorio' },
          },
          trigger: {
            type: SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: triggerSeconds,
          },
        });
      } catch (error) {
        console.warn('[Reminders] Notificación nativa omitida por entorno:', error);
        Alert.alert(
          '¡Recordatorio programado!',
          `Guardado para dentro de ${triggerSeconds} segundos.`
        );
      }

      const newReminder: Reminder = {
        id: Date.now().toString(),
        title,
        description,
        scheduledDate: scheduledDate.getTime(),
        notificationId,
        completed: false,
        createdAt: Date.now(),
      };

      setReminders((prev) => {
        const updated = [newReminder, ...prev];
        persistReminders(updated);
        return updated;
      });
    },
    [permissionStatus, requestPermission, persistReminders]
  );

  return {
    permissionStatus,
    loading,
    requestPermission,
    addReminder,
  };
}