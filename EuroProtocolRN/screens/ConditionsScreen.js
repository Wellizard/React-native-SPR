import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useReport } from '../AppContext';
import { C, S } from '../theme';

const ITEMS = [
    'У ДТП брали участь лише два транспортні засоби',
    'Ніхто не отримав тілесних ушкоджень',
    'Пошкоджено лише транспортні засоби (немає іншого майна)',
    'Обидва водії згодні з обставинами ДТП і мають чинні поліси ОСЦПВ',
];

export default function ConditionsScreen({ navigation }) {
    const { report, update } = useReport();
    const all = report.conditions.every(Boolean);
    const toggle = (i) => update('conditions', report.conditions.map((v, k) => (k === i ? !v : v)));

    return (
        <ScrollView style={S.screen} contentContainerStyle={S.pad}>
            <Text style={S.h1}>Перевірте умови</Text>
            <Text style={S.p}>Європротокол можна оформити, лише якщо виконано всі пункти.</Text>
            <View style={{ marginTop: 16, gap: 10 }}>
                {ITEMS.map((t, i) => (
                    <TouchableOpacity key={i} style={[S.card, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => toggle(i)}>
                        <View style={{
                            width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: C.blue,
                            backgroundColor: report.conditions[i] ? C.blue : 'transparent',
                            alignItems: 'center', justifyContent: 'center', marginRight: 12,
                        }}>
                            {report.conditions[i] && <Text style={{ color: '#fff', fontWeight: '800' }}>✓</Text>}
                        </View>
                        <Text style={{ flex: 1, fontSize: 15, color: C.text, lineHeight: 21 }}>{t}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {!all && <Text style={[S.p, { color: C.danger }]}>Підтвердіть усі пункти, щоб продовжити.</Text>}
            <TouchableOpacity
                style={[S.btn, !all && { opacity: 0.4 }]}
                disabled={!all}
                onPress={() => navigation.navigate('DateTime')}
            >
                <Text style={S.btnText}>Далі</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}