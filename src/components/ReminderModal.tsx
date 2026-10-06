import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Text, TextInput, Button } from 'react-native-paper';
import { NewReminder } from '../../types';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: NewReminder) => void;
}

export default function ReminderModal({ visible, onClose, onSave }: ReminderModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seconds, setSeconds] = useState('10');

  const handleSave = () => {
    if (!title.trim()) return;

    const delay = parseInt(seconds, 10) || 10;
    const scheduledDate = new Date(Date.now() + delay * 1000);

    onSave({
      title: title.trim(),
      description: description.trim(),
      scheduledDate,
    });

    setTitle('');
    setDescription('');
    setSeconds('10');
    onClose();
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
        <Text style={styles.title}>Programa un recordatorio de compra</Text>

        <TextInput
          label="Comprar vegetales..."
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          style={[styles.input, styles.label]}
          outlineColor="#8A2BE2"
          activeOutlineColor="#8A2BE2"
        />

        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          style={[styles.input, styles.label]}
          outlineColor="#8A2BE2"
          activeOutlineColor="#8A2BE2"
        />

        <TextInput
          label="Recordatorio en (segundos)"
          value={seconds}
          onChangeText={setSeconds}
          keyboardType="numeric"
          mode="outlined"
          style={[styles.input, styles.label]}
          outlineColor="#8A2BE2"
          activeOutlineColor="#8A2BE2"
        />

        <View style={styles.actions}>
          <Button mode="text" onPress={onClose} textColor="#666">
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSave} buttonColor="#8A2BE2" style={styles.btn}>
            Guardar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  btn: {
    marginLeft: 8,
  },
});