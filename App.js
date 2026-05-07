import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';

export default function App() {
  const [cidade, setCidade] = useState('Aracoiaba');
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'd9517f3f0210841a527988e7b7bbc784';

  const buscarClima = async () => {
    if (!cidade.trim()) {
      Alert.alert('Erro', 'Digite o nome da cidade');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`
      );

      if (!response.ok) {
        throw new Error('Cidade não encontrada');
      }

      const data = await response.json();

      setClima({
        nome: data.name || cidade,
        temperatura: data.main?.temp ?? 'N/A',
        sensacao: data.main?.feels_like ?? 'N/A',
        descricao: data.weather?.[0]?.description ?? 'Não disponível',
        umidade: data.main?.humidity ?? 'N/A',
        vento: data.wind?.speed ?? 'N/A',
      });
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar dados. Verifique a cidade ou sua conexão.');
      setClima(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Executa automaticamente ao abrir o app
  useEffect(() => {
    buscarClima();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🌤️ Aplicativo de Clima</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome da cidade"
        value={cidade}
        onChangeText={setCidade}
      />

      <TouchableOpacity style={styles.botao} onPress={buscarClima}>
        <Text style={styles.textoBotao}>Buscar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {clima && (
        <View style={styles.card}>
          <Text style={styles.cidade}>{clima.nome}</Text>
          <Text>🌡️ Temperatura: {clima.temperatura} °C</Text>
          <Text>🤔 Sensação: {clima.sensacao} °C</Text>
          <Text>☁️ Clima: {clima.descricao}</Text>
          <Text>💧 Umidade: {clima.umidade}%</Text>
          <Text>🌬️ Vento: {clima.vento} m/s</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#e6f2ff',
  },
  titulo: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  botao: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  cidade: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

