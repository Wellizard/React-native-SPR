import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';

const PRIORITIES = ['low', 'medium', 'high'];
const PRIORITY_COLORS = { low: '#4CC3A0', medium: '#F2C75C', high: '#E5675C' };

const todayString = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

const isValidDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Формат дати: РРРР-ММ-ДД';
    const d = new Date(value);
    if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) {
        return 'Некоректна дата';
    }
    return true;
};

export { PRIORITY_COLORS };

export default function TodoForm({ visible, onSubmit, onClose }) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: '',
            date: todayString(),
            priority: 'medium',
            status: 'to-do', // статус за замовчуванням
        },
    });

    const close = () => {
        reset();
        onClose();
    };

    const submit = (data) => {
        onSubmit({ ...data, title: data.title.trim(), status: 'to-do' });
        close();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.sheet}>
                    <Text style={styles.heading}>Нове завдання</Text>

                    {/* Назва */}
                    <Text style={styles.label}>Назва</Text>
                    <Controller
                        control={control}
                        name="title"
                        rules={{
                            required: 'Введіть назву',
                            validate: (v) => v.trim().length > 0 || 'Введіть назву',
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.title && styles.inputError]}
                                placeholder="Наприклад, Meet Lorence"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

                    {/* Дата */}
                    <Text style={styles.label}>Дата</Text>
                    <Controller
                        control={control}
                        name="date"
                        rules={{ required: 'Введіть дату', validate: isValidDate }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={[styles.input, errors.date && styles.inputError]}
                                placeholder="РРРР-ММ-ДД"
                                keyboardType="numbers-and-punctuation"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                            />
                        )}
                    />
                    {errors.date && <Text style={styles.error}>{errors.date.message}</Text>}

                    {/* Пріоритет */}
                    <Text style={styles.label}>Пріоритет</Text>
                    <Controller
                        control={control}
                        name="priority"
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.row}>
                                {PRIORITIES.map((p) => {
                                    const active = value === p;
                                    return (
                                        <TouchableOpacity
                                            key={p}
                                            onPress={() => onChange(p)}
                                            style={[
                                                styles.chip,
                                                active && { backgroundColor: PRIORITY_COLORS[p], borderColor: PRIORITY_COLORS[p] },
                                            ]}
                                        >
                                            <Text style={[styles.chipText, active && { color: '#fff' }]}>{p}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    />

                    <Text style={styles.statusInfo}>Статус: to-do</Text>

                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={close}>
                            <Text style={styles.btnCancelText}>Скасувати</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleSubmit(submit)}>
                            <Text style={styles.btnSaveText}>Додати</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 24,
    },
    heading: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
    label: { fontSize: 13, fontWeight: '600', color: '#444', marginTop: 14, marginBottom: 6 },
    input: {
        borderWidth: 1,
        borderColor: '#D5DAE3',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        backgroundColor: '#F7F9FB',
    },
    inputError: { borderColor: '#E5675C' },
    error: { color: '#E5675C', fontSize: 12, marginTop: 4 },
    row: { flexDirection: 'row' },
    chip: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        marginRight: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D5DAE3',
    },
    chipText: { fontWeight: '600', color: '#444' },
    statusInfo: { marginTop: 16, color: '#777', fontSize: 13 },
    actions: { flexDirection: 'row', marginTop: 20 },
    btn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    btnCancel: { backgroundColor: '#EEF1F6', marginRight: 8 },
    btnCancelText: { fontWeight: '600', color: '#444' },
    btnSave: { backgroundColor: '#5A8CF2' },
    btnSaveText: { fontWeight: '700', color: '#fff' },
});