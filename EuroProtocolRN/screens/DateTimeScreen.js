import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useReport } from '../AppContext';
import { S } from '../theme';

export default function DateTimeScreen({ navigation }) {
    const { report, update } = useReport();
    const [mode, setMode] = useState(null); // 'date' | 'time' | null
    const d = report.dateTime;

    const onChange = (_, selected) => {
        if (Platform.OS === 'android') setMode(null);
        if (selected) update('dateTime', selected);
    };

    return (
        <ScrollView style={S.screen} contentContainerStyle={S.pad}>
            <Text style={S.h1}>Коли сталася ДТП?</Text>

            <Text style={S.label}>Дата</Text>
            <TouchableOpacity style={S.input} onPress={() => setMode('date')}>
                <Text style={{ fontSize: 16 }}>{d.toLocaleDateString('uk-UA')}</Text>
            </TouchableOpacity>

            <Text style={S.label}>Час</Text>
            <TouchableOpacity style={S.input} onPress={() => setMode('time')}>
                <Text style={{ fontSize: 16 }}>{d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {mode && (
                <DateTimePicker
                    value={d}
                    mode={mode}
                    is24Hour
                    maximumDate={new Date()}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onChange}
                />
            )}

            <TouchableOpacity style={S.btn} onPress={() => navigation.navigate('Participants')}>
                <Text style={S.btnText}>Далі</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}