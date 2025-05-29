import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Info } from 'lucide-react-native';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';

interface PredefinedMessagesProps {
  messages: string[];
  onMessageSelect: (message: string) => void;
}

export default function PredefinedMessages({
  messages,
  onMessageSelect,
}: PredefinedMessagesProps) {
  return (
    <>
      <View>
        <View style={styles.predefinedContainer}>
          <ScrollView contentContainerStyle={styles.predefinedContent}>
            {messages.map((message, index) => (
              <TouchableOpacity
                key={index}
                style={styles.predefinedMessage}
                onPress={() => onMessageSelect(message)}
              >
                <Text style={styles.predefinedText}>{message}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <View>
        <View style={styles.infoContainer}>
          <Info size={16} color="#1C33FF" style={{ marginTop: 5 }} />
          <Text style={styles.infoText}>
            Predefined messages can be sent, You can chat with the traveler
            after payment.
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: '100%',
    backgroundColor: Colors.secondary,
  },
  infoText: {
    flex: 1,
    width: '100%',
    flexWrap: 'wrap',
    fontSize: 14,
    color: Colors.primary,
    opacity: 0.8,
    fontFamily: 'OpenSans_400Regular'
  },
  predefinedContainer: {
    maxHeight: 150,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  predefinedContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  predefinedMessage: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginRight: 4,
    borderWidth: 0.5,
    borderColor: '#ccc',
  },
  predefinedText: {
    fontSize: 14,
    color: Colors.primary,
    fontFamily: 'OpenSans_400Regular'
  },
});
