import { StyleSheet } from 'react-native';

export const C = {
  blue: '#0B3A6E', yellow: '#FFD500', bg: '#F5F7FA', card: '#FFFFFF',
  text: '#14213D', muted: '#6B7A90', line: '#D8DFE8', danger: '#C62828',
};

export const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  pad: { padding: 20, paddingBottom: 40 },
  h1: { fontSize: 28, fontWeight: '800', color: C.blue },
  p: { fontSize: 15, color: C.muted, marginTop: 8, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '600', color: C.muted, marginTop: 16, marginBottom: 6 },
  input: {
    backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: C.text,
  },
  btn: { backgroundColor: C.blue, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnAlt: { backgroundColor: C.card, borderWidth: 1.5, borderColor: C.blue },
  btnAltText: { color: C.blue },
  card: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.line, padding: 14 },
});