import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useReport } from '../AppContext';
import { C, S } from '../theme';

const FIELDS = [
    { key: 'name', label: 'ПІП', placeholder: 'Шевченко Тарас Григорович', type: 'default' },
    { key: 'birth', label: 'Дата народження', placeholder: 'ДД.ММ.РРРР', type: 'numbers-and-punctuation' },
    { key: 'plate', label: 'Номер автомобіля', placeholder: 'АА1234ВВ', type: 'default', caps: 'characters' },
    { key: 'phone', label: 'Телефон', placeholder: '+380 XX XXX XX XX', type: 'phone-pad' },
];

export default function ParticipantsScreen({ navigation }) {
    const { report, update } = useReport();
    const [who, setWho] = useState('A');
    const p = report.participants[who];

    const setField = (k, v) =>
        update('participants', { ...report.participants, [who]: { ...p, [k]: v } });

    return (
        <ScrollView style={S.screen} contentContainerStyle={S.pad} keyboardShouldPersistTaps="handled">
            <View style={{ flexDirection: 'row', backgroundColor: C.line, borderRadius: 10, padding: 3 }}>
                {['A', 'B'].map((k) => (
                    <TouchableOpacity
                        key={k}
                        onPress={() => setWho(k)}
                        style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center', backgroundColor: who === k ? C.card : 'transparent' }}
                    >
                        <Text style={{ fontWeight: '700', color: who === k ? C.blue : C.muted }}>Учасник {k}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {FIELDS.map((f) => (
                <View key={f.key}>
                    <Text style={S.label}>{f.label}</Text>
                    <TextInput
                        style={S.input}
                        value={p[f.key]}
                        onChangeText={(v) => setField(f.key, v)}
                        placeholder={f.placeholder}
                        placeholderTextColor="#A5B0C0"
                        keyboardType={f.type}
                        autoCapitalize={f.caps || 'words'}
                    />
                </View>
            ))}

            <TouchableOpacity style={S.btn} onPress={() => navigation.navigate('Location')}>
                <Text style={S.btnText}>Далі</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}