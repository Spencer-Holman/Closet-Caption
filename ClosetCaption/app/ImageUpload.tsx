import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    console.log("Button pressed - pickImage started"); // Log when button is pressed

    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Result is:", result); // Log result to see structure

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
      console.log("Image URI is:", result.assets[0].uri); // Log URI if available
    } else {
      console.log("No image selected");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Upload Page</Text>
      <Button title="Select Image" onPress={pickImage} />
      {image != null ? <Image source={{ uri: image }} style={styles.image} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 10,
  },
});
