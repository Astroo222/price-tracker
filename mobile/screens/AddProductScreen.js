import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

export default function AddProductScreen({ navigation, token, route }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [alertPct, setAlertPct] = useState('10');

  const search = async () => {
    if (!query) return;
    setLoading(true);
    setResults([]);
    setSelected(null);
    try {
      const res = await axios.get(`${API_URL}/products/search?q=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setResults(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const track = async () => {
    if (!selected) return;
    try {
      await axios.post(`${API_URL}/products`,
        { url: selected.link, target_price: targetPrice || null, alert_pct: alertPct || 10, product_name: selected.name, current_price: selected.raw_price, store: selected.store },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      route.params?.refresh?.();
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  if (selected) {
    return (
      <View style={s.container}>
        <TouchableOpacity onPress={() => setSelected(null)}>
          <Text style={s.back}>← Retour aux résultats</Text>
        </TouchableOpacity>
        <View style={s.selectedCard}>
          {selected.thumbnail && <Image source={{ uri: selected.thumbnail }} style={s.bigImg} />}
          <Text style={s.selectedName}>{selected.name}</Text>
          <Text style={s.selectedStore}>{selected.store}</Text>
          <Text style={s.selectedPrice}>{selected.price}</Text>
        </View>
        <Text style={s.label}>Prix cible (optionnel)</Text>
        <TextInput style={s.input} value={targetPrice} onChangeText={setTargetPrice}
          placeholder="ex: 199.99" keyboardType="decimal-pad" />
        <Text style={s.label}>Alerte si baisse de % (défaut 10%)</Text>
        <TextInput style={s.input} value={alertPct} onChangeText={setAlertPct}
          placeholder="10" keyboardType="decimal-pad" />
        <TouchableOpacity style={s.btn} onPress={track}>
          <Text style={s.btnText}>Commencer le suivi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <View style={s.searchRow}>
        <TextInput style={s.searchInput} value={query} onChangeText={setQuery}
          placeholder="Cherche un produit..." onSubmitEditing={search} returnKeyType="search" />
        <TouchableOpacity style={s.searchBtn} onPress={search}>
          <Text style={s.searchBtnText}>Chercher</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator style={{ marginTop: 40 }} size="large" />}
<View style={{ flex: 1, overflow: 'scroll', maxHeight: '80vh' }}>
  {results.map((item, i) => (
    <TouchableOpacity key={i} style={s.resultCard} onPress={() => setSelected(item)}>
      {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={s.thumb} />}
      <View style={s.resultInfo}>
        <Text style={s.resultName} numberOfLines={2}>{item.name}</Text>
        <Text style={s.resultStore}>{item.store}</Text>
        <Text style={s.resultPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  ))}
</View>
    </View>
  );
}

const s = StyleSheet.create({
container: { flex: 1, backgroundColor: '#fff', padding: 12, overflow: 'hidden' },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchInput: { flex: 1, borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8, padding: 10, fontSize: 14 },
  searchBtn: { backgroundColor: '#1a1a1a', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '500' },
  resultCard: { flexDirection: 'row', gap: 12, padding: 12, borderBottomWidth: 0.5, borderColor: '#eee' },
  thumb: { width: 70, height: 70, borderRadius: 6, backgroundColor: '#f5f5f5' },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  resultStore: { fontSize: 12, color: '#888', marginBottom: 2 },
  resultPrice: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  back: { color: '#2d7dd2', fontSize: 14, marginBottom: 16 },
  selectedCard: { alignItems: 'center', marginBottom: 20, padding: 16, borderWidth: 0.5, borderColor: '#eee', borderRadius: 12 },
  bigImg: { width: 160, height: 160, borderRadius: 8, marginBottom: 12, backgroundColor: '#f5f5f5' },
  selectedName: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 6 },
  selectedStore: { fontSize: 13, color: '#888', marginBottom: 4 },
  selectedPrice: { fontSize: 24, fontWeight: '600' },
  label: { fontSize: 13, color: '#666', marginBottom: 6, marginTop: 16 },
  input: { borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14 },
  btn: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 24 },
  btnText: { color: '#fff', fontWeight: '500', fontSize: 15 },
});