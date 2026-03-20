import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

export default function HomeScreen({ navigation, token }) {
  const [products, setProducts] = useState([]);

  const load = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`,
        { headers: { Authorization: `Bearer ${token}` } });
      setProducts(res.data);
    } catch (e) { Alert.alert('Erreur de chargement'); }
  };

  useEffect(() => { load(); }, []);

  const deleteProduct = async (id) => {
    await axios.delete(`${API_URL}/products/${id}`,
      { headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  return (
    <View style={s.container}>
      <FlatList
        data={products}
        keyExtractor={i => i.id}
        ListEmptyComponent={<Text style={s.empty}>Aucun produit suivi.\nAjoutes-en un !</Text>}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.name} numberOfLines={2}>{item.product_name || 'Chargement...'}</Text>
            <Text style={s.store}>{item.store}</Text>
            <Text style={s.price}>{item.current_price ? `$${item.current_price}` : 'Vérification...'}</Text>
            {item.target_price && <Text style={s.target}>Cible : ${item.target_price}</Text>}
            <TouchableOpacity onPress={() => deleteProduct(item.id)}>
              <Text style={s.del}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={s.fab}
        onPress={() => navigation.navigate('AddProduct', { refresh: load })}>
        <Text style={s.fabText}>+ Ajouter un produit</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  card: { backgroundColor: '#fff', margin: 12, marginBottom: 0, padding: 16, borderRadius: 12, borderWidth: 0.5, borderColor: '#e0e0e0' },
  name: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
  store: { fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'capitalize' },
  price: { fontSize: 22, fontWeight: '600', color: '#1a1a1a', marginBottom: 4 },
  target: { fontSize: 12, color: '#2d7dd2' },
  del: { fontSize: 12, color: '#e24b4a', marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 60, color: '#888', fontSize: 15, lineHeight: 24 },
  fab: { backgroundColor: '#1a1a1a', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center' },
  fabText: { color: '#fff', fontWeight: '500' },
});