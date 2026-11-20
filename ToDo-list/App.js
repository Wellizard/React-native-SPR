import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TodoForm, { PRIORITY_COLORS } from './TodoForm';

const API_URL = 'https://dummyjson.com/todos?limit=10';

// API не повертає час, тому підставляємо його за індексом (як на макеті)
const TIMES = ['12 pm', '1 pm', '3 pm', '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm'];

const formatDate = (date) => {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
    day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  const month = date.toLocaleString('en-US', { month: 'long' });
  return `${day}${suffix} ${month} ${date.getFullYear()}`;
};

// Приводимо завдання із сервера до єдиної структури
const normalize = (t, index) => ({
  id: String(t.id),
  title: t.todo,
  date: null,
  label: TIMES[index % TIMES.length],
  priority: 'medium',
  status: t.completed ? 'done' : 'to-do',
});

const TodoItem = ({ item, onToggle }) => {
  const done = item.status === 'done';
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => onToggle(item.id)}>
      <View style={styles.cardLeft}>
        {done && (
          <View style={styles.check}>
            <Ionicons name="checkmark" size={12} color="#fff" />
          </View>
        )}
        <Text style={[styles.todoText, done && styles.todoDone]} numberOfLines={1}>
          {item.title}
        </Text>
      </View>
      <View style={styles.cardRight}>
        <View style={[styles.dot, { backgroundColor: PRIORITY_COLORS[item.priority] }]} />
        <Text style={styles.time}>{item.date ?? item.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const loadTodos = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      setTodos(json.todos.map(normalize));
    } catch (e) {
      setError('Не вдалося завантажити завдання');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const onRefresh = () => {
    setRefreshing(true);
    loadTodos();
  };

  // Додаємо нове завдання з форми на початок списку
  const addTodo = ({ title, date, priority, status }) => {
    setTodos((prev) => [
      { id: `local-${Date.now()}`, title, date, label: date, priority, status },
      ...prev,
    ]);
  };

  // Тап по завданню перемикає статус to-do <-> done
  const toggleStatus = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'done' ? 'to-do' : 'done' } : t
      )
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      <SafeAreaView style={styles.screen}>
        <View style={styles.sheet}>
          <Text style={styles.title}>ODOT List</Text>
          <Text style={styles.date}>{formatDate(new Date())}</Text>

          <View style={styles.listWrap}>
            {loading ? (
              <ActivityIndicator size="large" color="#4A7BE0" style={{ marginTop: 40 }} />
            ) : error ? (
              <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={loadTodos} style={styles.retry}>
                  <Text style={styles.retryText}>Спробувати ще</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={todos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TodoItem item={item} onToggle={toggleStatus} />}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              />
            )}
          </View>

          <View style={styles.tabBar}>
            <Ionicons name="list" size={22} color="#4A7BE0" />
            <Ionicons name="time-outline" size={22} color="#B5BCC9" />
            <View style={{ width: 70 }} />
            <Ionicons name="notifications-outline" size={22} color="#B5BCC9" />
            <Ionicons name="person-outline" size={22} color="#B5BCC9" />
          </View>

          <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setFormVisible(true)}>
            <Ionicons name="add" size={34} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <TodoForm
        visible={formVisible}
        onSubmit={addTodo}
        onClose={() => setFormVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  bgTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%', backgroundColor: '#F2C75C' },
  bgBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%', backgroundColor: '#4F7BD8' },
  screen: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  sheet: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    backgroundColor: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    paddingTop: 36,
    paddingBottom: 24,
  },
  date: {
    backgroundColor: '#fff',
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  listWrap: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  cardRight: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  check: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CC3A0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  todoText: { fontSize: 13, fontWeight: '700', color: '#111', flexShrink: 1 },
  todoDone: { textDecorationLine: 'line-through' },
  time: { fontSize: 13, color: '#333' },
  center: { alignItems: 'center', marginTop: 40 },
  errorText: { color: '#C0392B', marginBottom: 12 },
  retry: { backgroundColor: '#4A7BE0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  retryText: { color: '#fff', fontWeight: '600' },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 56,
    backgroundColor: '#F2F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#5A8CF2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#4A7BE0',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});