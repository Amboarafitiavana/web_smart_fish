import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

export default function Index() {
  const [result, setResult] = useState("pas encore testé");
  const [loginResult, setLoginResult] = useState("pas encore testé");

const testLogin = async () => {
  try {
    const res = await fetch("http://192.168.137.1:8000/api/v1/users", { // adapte le chemin exact de ton endpoint
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullname: "admin",
        email: "admin@example.com",
        role: "admin",
        password: "1234",
      }),
    });
    const data = await res.json();
    setLoginResult(res.ok ? `✅ Token reçu: ${data.access_token?.slice(0, 20)}...` : `❌ ${res.status}: ${JSON.stringify(data)}`);
  } catch (e) {
    setLoginResult(`❌ ${e}`);
  }
};

  const pingBackend = async () => {
    try {
      const res = await fetch("http://192.168.137.1:8000/docs");
      setResult(res.ok ? "✅ Connexion OK" : `❌ Erreur ${res.status}`);
    } catch (e) {
      setResult(`❌ ${e}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{result}</Text>
      <Button title="Ping backend" onPress={pingBackend} />

      <Text>{loginResult}</Text>
      <Button title="Test login" onPress={testLogin} />
    </View>
  );
}