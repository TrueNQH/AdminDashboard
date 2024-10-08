import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = () => {
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productList, setProductList] = useState([]);
  const [imageUri, setImageUri] = useState('');

  const addProduct = () => {
    if (productName && productType && productPrice && imageUri) {
      const newProduct = {
        name: productName,
        type: productType,
        price: productPrice,
        image: imageUri, // Image selected
      };
      setProductList([...productList, newProduct]);
      setProductName('');
      setProductType('');
      setProductPrice('');
      setImageUri(''); // Clear image after adding product
    }
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const renderProduct = ({ item, index }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text>Tên sp: {item.name}</Text>
        <Text>Giá sp: {item.price}</Text>
        <Text>Loại sp: {item.type}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteProduct(index)}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dữ liệu sản phẩm</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Loại sản phẩm"
        value={productType}
        onChangeText={setProductType}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
      />
      <View style={styles.fileInputContainer}>
        <Text>{imageUri ? imageUri.split('/').pop() : 'Chọn hình ảnh'}</Text>
        <TouchableOpacity style={styles.fileButton} onPress={selectImage}>
          <Text>📁</Text>
        </TouchableOpacity>
      </View>
      <Button title="Thêm sản phẩm" onPress={addProduct} color="#007BFF" />

      <Text style={styles.productListHeader}>Danh sách sản phẩm:</Text>
      <FlatList
        data={productList}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>Chưa có sản phẩm nào.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
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
  fileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fileButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  productListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 10,
    backgroundColor: '#FFD700',
    padding: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  actionText: {
    fontSize: 16,
  },
});

export default HomeScreen;
