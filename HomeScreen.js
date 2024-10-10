import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from './AuthContext'; // Make sure to import the AuthContext
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'; // Firestore functions
import { app } from './firebase'; // Import your Firebase config

const HomeScreen = ({ navigation }) => {
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productList, setProductList] = useState([]); // To store product list fetched from Firestore
  const [imageUri, setImageUri] = useState('');
  const [editingIndex, setEditingIndex] = useState(null); // To track the product being edited
  const { username } = useContext(AuthContext); // Get username from AuthContext

  const db = getFirestore(app); // Initialize Firestore

  // Fetch existing products from Firestore when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const docRef = doc(db, 'products', username);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProductList(docSnap.data().productList || []); // Set product list from Firestore
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching products from Firestore: ', error);
      }
    };

    fetchProducts();
  }, [username]);

  const addProduct = async () => {
    if (productName && productType && productPrice && imageUri) {
      const newProduct = {
        name: productName,
        type: productType,
        price: productPrice,
        image: imageUri,
      };

      try {
        if (editingIndex !== null) {
          // Update the product locally and in Firestore
          const updatedList = [...productList];
          updatedList[editingIndex] = newProduct;
          setProductList(updatedList);
          setEditingIndex(null); // Reset editing index

          // Update Firestore document
          await updateDoc(doc(db, 'products', username), {
            productList: updatedList,
          });
        } else {
          // Add new product locally
          const updatedList = [...productList, newProduct];
          setProductList(updatedList);

          // Add to Firestore
          await setDoc(doc(db, 'products', username), {
            productList: arrayUnion(newProduct),
          }, { merge: true });
        }

        // Reset form fields
        setProductName('');
        setProductType('');
        setProductPrice('');
        setImageUri('');
      } catch (error) {
        console.error('Error adding product to Firestore: ', error);
      }
    }
  };

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // Set the selected image
    }
  };

  const editProduct = (index) => {
    const product = productList[index];
    setProductName(product.name);
    setProductType(product.type);
    setProductPrice(product.price);
    setImageUri(product.image);
    setEditingIndex(index); // Track the index of the product being edited
  };

  const deleteProduct = async (index) => {
    const updatedList = productList.filter((_, i) => i !== index);
    setProductList(updatedList);

    try {
      // Update Firestore after deleting the product
      await updateDoc(doc(db, 'products', username), {
        productList: updatedList,
      });
    } catch (error) {
      console.error('Error deleting product from Firestore: ', error);
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
        <TouchableOpacity style={styles.editButton} onPress={() => editProduct(index)}>
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
      <Button
        title={editingIndex !== null ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        onPress={addProduct}
        color="#007BFF"
      />

      <Text style={styles.productListHeader}>Danh sách sản phẩm:</Text>
      <FlatList
        data={productList}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text>Chưa có sản phẩm nào.</Text>}
      />
      <Button title="Đăng xuất"   color="#007BFF" onPress={() => {
          // Xử lý đăng xuất ở đây
          navigation.replace('Login');
          
        }} />
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
