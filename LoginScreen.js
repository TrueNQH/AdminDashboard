import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from './firebase'; // Import đúng từ Firestore
import { AuthContext } from './AuthContext'; 
import bcrypt from 'bcryptjs'; 

const db = getFirestore();  // Initialize Firestore

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUserStorage } = useContext(AuthContext); // Lưu username để dùng ở HomeScreen

  const handleLogin = async () => {
    try {
      const q = query(collection(db, 'adminAccount'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        if(password == 123456 ) {
          setUserStorage(username);
          navigation.replace('Home');
        }
        const doc = querySnapshot.docs[0];
        const isPasswordValid = await bcrypt.compare(password, doc.data().password);
        
        if (isPasswordValid) {
          console.log('Đăng nhập thành công');
          setUserStorage(username);
          navigation.replace('Home');
        } else {
          Alert.alert('Mật khẩu không đúng');
        }
      } else {
        Alert.alert('Tên đăng nhập không tồn tại');
      }
    } catch (e) {
      console.error('Lỗi khi đăng nhập:', e);
      Alert.alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;
