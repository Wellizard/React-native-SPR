import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useReport } from '../AppContext';
import { C, S } from '../theme';

const KYIV = { latitude: 50.4501, longitude: 30.5234, latitudeDelta: 0.05, longitudeDelta: 0.05 };

export default function LocationScreen({ navigation }) {
    const { report, update } = useReport();
    const { text, coord } = report.place;
    const set = (patch) => update('place', { ...report.place, ...patch });

    return (
        <ScrollView style={S.screen} contentContainerStyle={S.pad} keyboardShouldPersistTaps="handled">
            <Text style={S.h1}>Де сталася ДТП?</Text>

            <Text style={S.label}>Адреса або орієнтир</Text>
            <TextInput
                style={[S.input, { minHeight: 70, textAlignVertical: 'top' }]}
                multiline
                value={text}
                onChangeText={(v) => set({ text: v })}
                placeholder="м. Київ, вул. Хрещатик, 22, перехрестя з вул. Прорізною"
                placeholderTextColor="#A5B0C0"
            />

            <Text style={S.label}>Або позначте точку на карті</Text>
            <View style={{ height: 280, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.line }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={coord ? { ...coord, latitudeDelta: 0.01, longitudeDelta: 0.01 } : KYIV}
                    onPress={(e) => set({ coord: e.nativeEvent.coordinate })}
                >
                    {coord && <Marker coordinate={coord} />}
                </MapView>
            </View>
            <Text style={S.p}>
                {coord ? `Обрано: ${coord.latitude.toFixed(5)}, ${coord.longitude.toFixed(5)}` : 'Торкніться карти, щоб поставити мітку.'}
            </Text>

            <TouchableOpacity style={S.btn} onPress={() => navigation.navigate('Sketch')}>
                <Text style={S.btnText}>Далі</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}