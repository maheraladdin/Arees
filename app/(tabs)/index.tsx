import { StyleSheet } from 'react-native';
import {useEffect, useState} from "react";
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const [data, setData] = useState("");

  useEffect(() => {
    (async () => {
      const res = await fetch("http://192.168.1.18:8081/api/hello").then(res => res.json());
      setData(res.hello);
    })()
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>hello {data}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
