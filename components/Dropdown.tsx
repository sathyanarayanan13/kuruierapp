import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Text from './Text';
import Colors from '@/constants/Colors';
import DropDown from '@/assets/svgs/DropDown';

interface DropdownProps {
  value: string;
  items: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({ value, items, onChange, placeholder }: DropdownProps) {
  const [visible, setVisible] = useState(false);

  const toggleDropdown = () => {
    setVisible(!visible);
  };

  const handleSelect = (item: string) => {
    onChange(item);
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={[styles.buttonText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <DropDown width={15} height={15} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={items}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[
                    styles.itemText,
                    item === value && styles.selectedItemText
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_500Medium',
  },
  placeholderText: {
    color: '#999',
    fontFamily: 'OpenSans_500Medium',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dropdown: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    width: '100%',
    maxHeight: 300,
    padding: 8,
    fontFamily: 'OpenSans_500Medium',
  },
  item: {
    padding: 16,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: Colors.primary,
  },
  selectedItemText: {
    color: Colors.mainTheme,
    fontFamily: 'OpenSans_600SemiBold',
  },
});