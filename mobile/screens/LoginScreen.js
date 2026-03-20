import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const submit = async () => {
    if (!email || !password) return Alert.alert('Remplis tous les champs');
    try {
      const route = isRegister ? '/auth/register' : '/auth/login';
      const res = await axios.post(`${API_URL}${route}`, { email, password });
      onLogin(res.data.token);
    } catch (e) {
      Alert.alert('Erreur', e.response?.data?.error || 'Connexion impossible');
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>Price Tracker</Text>
      <TextInput style={s.input} placeholder="Email" value={email}
        onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={s.input} placeholder="Mot de passe" value={password}
        onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={s.btn} onPress={submit}>
        <Text style={s.btnText}>{isRegister ? 'Créer un compte' : 'Se connecter'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={s.switch}>
          {isRegister ? 'Déjà un compte ? Se connecter' : 'Pas de compte ? S\'inscrire'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '600', textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 0.5, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14, marginBottom: 12 },
  btn: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '500', fontSize: 15 },
  switch: { textAlign: 'center', marginTop: 16, color: '#666', fontSize: 13 },
});