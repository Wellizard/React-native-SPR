import React, { useRef, useState } from 'react';
import { Alert, PanResponder, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as DocumentPicker from 'expo-document-picker';
import { useReport } from '../AppContext';
import { C, S } from '../theme';

export default function SketchScreen({ navigation }) {
    const { report, update } = useReport();
    const [paths, setPaths] = useState(report.sketch.paths);
    const [current, setCurrent] = useState('');
    const [scrollOn, setScrollOn] = useState(true);
    const currentRef = useRef('');
    const pathsRef = useRef(paths);

    const responder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                setScrollOn(false);
                const { locationX: x, locationY: y } = e.nativeEvent;
                currentRef.current = `M${x.toFixed(1)},${y.toFixed(1)}`;
                setCurrent(currentRef.current);
            },
            onPanResponderMove: (e) => {
                const { locationX: x, locationY: y } = e.nativeEvent;
                currentRef.current += ` L${x.toFixed(1)},${y.toFixed(1)}`;
                setCurrent(currentRef.current);
            },
            onPanResponderRelease: () => {
                pathsRef.current = [...pathsRef.current, currentRef.current];
                setPaths(pathsRef.current);
                setCurrent('');
                setScrollOn(true);
            },
        })
    ).current;

    const undo = () => { pathsRef.current = pathsRef.current.slice(0, -1); setPaths(pathsRef.current); };
    const clear = () => { pathsRef.current = []; setPaths([]); };

    const pickFile = async () => {
        const res = await DocumentPicker.getDocumentAsync({ type: ['image/*', 'application/pdf'] });
        if (!res.canceled) update('sketch', { ...report.sketch, file: res.assets[0] });
    };

    const finish = () => {
        update('sketch', { ...report.sketch, paths });
        Alert.alert('Готово', 'Дані європротоколу заповнено.', [{ text: 'На головну', onPress: () => navigation.popToTop() }]);
    };

    const file = report.sketch.file;

    return (
        <ScrollView style={S.screen} contentContainerStyle={S.pad} scrollEnabled={scrollOn}>
            <Text style={S.h1}>Схема ДТП</Text>
            <Text style={S.p}>Намалюйте розташування авто та напрямки руху або прикріпіть готову схему.</Text>

            <View
                {...responder.panHandlers}
                style={{ height: 320, marginTop: 16, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: C.line, overflow: 'hidden' }}
            >
                <Svg style={{ flex: 1 }} pointerEvents="none">
                    {paths.map((d, i) => <Path key={i} d={d} stroke={C.blue} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
                    {!!current && <Path d={current} stroke={C.blue} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                </Svg>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
                <TouchableOpacity style={[S.btn, S.btnAlt, { flex: 1, marginTop: 0 }]} onPress={undo}>
                    <Text style={[S.btnText, S.btnAltText]}>Скасувати</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[S.btn, S.btnAlt, { flex: 1, marginTop: 0 }]} onPress={clear}>
                    <Text style={[S.btnText, S.btnAltText]}>Очистити</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={[S.btn, S.btnAlt]} onPress={pickFile}>
                <Text style={[S.btnText, S.btnAltText]}>{file ? 'Замінити файл' : 'Прикріпити файл'}</Text>
            </TouchableOpacity>
            {file && <Text style={S.p}>Прикріплено: {file.name}</Text>}

            <TouchableOpacity style={S.btn} onPress={finish}>
                <Text style={S.btnText}>Завершити</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}