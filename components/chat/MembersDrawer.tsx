import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Text from '@/components/Text';
import Colors from '@/constants/Colors';
import { Dot } from 'lucide-react-native';

interface Member {
  id: string;
  name: string;
  avatar: string;
  phone?: string;
  type: 'owner' | 'traveler' | 'receiver';
}

const members: Member[] = [
  {
    id: '1',
    name: 'Traveler 1',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    phone: '********92',
    type: 'owner',
  },
  {
    id: '2',
    name: 'Lenin Joseph',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    phone: '7377388939',
    type: 'traveler',
  },
  {
    id: '3',
    name: 'Sanjai Kumar',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    phone: '8627788288',
    type: 'receiver',
  },
];

interface MembersDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function MembersDrawer({ visible, onClose }: MembersDrawerProps) {
  const router = useRouter();

  const renderMemberSection = (type: 'owner' | 'traveler' | 'receiver') => {
    const title = type.charAt(0).toUpperCase() + type.slice(1);
    const member = members.find(m => m.type === type);

    if (!member) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle} semiBold>{title}</Text>
        <View style={styles.memberRow}>
          <Image source={{ uri: member.avatar }} style={styles.avatar} />
          <View style={{backgroundColor: '#fff', position: 'relative', padding: 3}}>
            <Dot color={type === 'traveler' ? '#FF3C78' : '#009D67'} size={40} style={styles.memberStatus}/>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberPhone}>{member.phone}</Text>
          </View>
          {type === 'traveler' && (
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => {
                onClose();
                router.push('/traveler-details');
              }}
            >
              <Text style={styles.detailsButtonText}>View</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {renderMemberSection('owner')}
            {renderMemberSection('traveler')}
            {renderMemberSection('receiver')}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: Colors.secondary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: Colors.primary,
  },
  closeButton: {
    fontSize: 24,
    color: Colors.primary,
  },
  content: {
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'OpenSans_600SemiBold'
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DBDFEE'
  },
  memberStatus : {
    position: 'absolute',
    bottom: 0,
    right: -8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    color: Colors.primary,
    marginBottom: 2,
    fontFamily: 'OpenSans_500Medium'
  },
  memberPhone: {
    fontSize: 12,
    color: Colors.primary,
    opacity: 0.7,
    fontFamily: 'OpenSans_500Medium'
  },
  detailsButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 40,
    backgroundColor: Colors.secondary,
    borderColor: '#1C33FF',
    borderWidth: 1
  },
  detailsButtonText: {
    fontSize: 12,
    color: '#1C33FF',
    fontFamily: 'OpenSans_500Medium'
  },
});