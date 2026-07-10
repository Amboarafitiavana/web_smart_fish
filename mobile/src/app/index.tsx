import { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";

export default function Index() {
  const [result, setResult] = useState("pas encore testé");

  const pingBackend = async () => {
    try {
      const res = await fetch("http://172.24.76.140:8000/docs");
      setResult(res.ok ? "✅ Connexion OK" : `❌ Erreur ${res.status}`);
    } catch (e) {
      setResult(`❌ ${e}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>{result}</Text>
      <Button title="Ping backend" onPress={pingBackend} />
    </View>
  );
}