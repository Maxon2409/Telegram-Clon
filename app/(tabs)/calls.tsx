import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Call {
  id: string;
  name: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

const mockCalls: Call[] = [
  { id: '1', name: 'Мама', time: 'Сегодня 12:30', type: 'outgoing' },
  { id: '2', name: 'Иван Петров', time: 'Вчера 18:45', type: 'incoming' },
  { id: '3', name: 'Алексей', time: '28 фев', type: 'missed' },
];

function CallItem({ call }: { call: Call }) {
  const getIcon = () => {
    switch (call.type) {
      case 'outgoing':
        return <Ionicons name="call" size={20} color="#34C759" />;
      case 'incoming':
        return <Ionicons name="call" size={20} color="#34C759" />;
      case 'missed':
        return <Ionicons name="call" size={20} color="#FF3B30" />;
    }
  };

  return (
    <TouchableOpacity style={styles.callItem} activeOpacity={0.7}>
      <View style={[styles.avatar, styles.callAvatar]}>
        <Text style={styles.avatarText}>
          {call.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </Text>
      </View>
      <View style={styles.callContent}>
        <Text style={[styles.callName, call.type === 'missed' && styles.missedName]}>
          {call.name}
        </Text>
        <View style={styles.callMeta}>
          {getIcon()}
          <Text style={styles.callTime}>{call.time}</Text>
        </View>
      </View>
      <TouchableOpacity>
        <Ionicons name="call" size={28} color="#0088CC" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function CallsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockCalls}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CallItem call={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingBottom: 20,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0088CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callAvatar: {
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  callContent: {
    flex: 1,
  },
  callName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  missedName: {
    color: '#FF3B30',
  },
  callMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callTime: {
    fontSize: 15,
    color: '#8E8E93',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginLeft: 74,
  },
});
