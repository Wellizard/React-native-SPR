import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, S } from '../theme';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.wrap}>
            <View style={styles.stripe} />
            <View style={styles.body}>
                <Text style={styles.title}>Європротокол</Text>
                <Text style={styles.sub}>
                    Оформіть повідомлення про ДТП без виклику поліції: кілька кроків, і всі дані зібрані в одному місці.
                </Text>
            </View>
            <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Conditions')}>
                <Text style={styles.btnText}>Оформити протокол</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1, backgroundColor: C.blue, padding: 24, justifyContent: 'space-between' },
    stripe: { height: 8, width: 72, backgroundColor: C.yellow, borderRadius: 4, marginTop: 70 },
    body: { flex: 1, justifyContent: 'center' },
    title: { color: '#fff', fontSize: 42, fontWeight: '800' },
    sub: { color: '#C9D6E8', fontSize: 17, lineHeight: 25, marginTop: 14 },
    btn: { backgroundColor: C.yellow, borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginBottom: 30 },
    btnText: { color: C.blue, fontSize: 18, fontWeight: '800' },
});