import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    console.log("Button pressed - pickImage started");

    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker without allowing editing
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    console.log("Result is:", result);

    if (!result.canceled && result.assets && result.assets[0].uri) {
      setImage(result.assets[0].uri);
      console.log("Image URI is:", result.assets[0].uri);
    } else {
      console.log("No image selected");
    }
  };

  const generateCaptions = () => {
    if (image) {
      console.log("Generating captions for image:", image);
      alert("Captions generated!"); // Placeholder for caption generation logic
    } else {
      alert("Please select an image first.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Upload Page</Text>
      <Button title="Select Image" onPress={pickImage} />
      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <Button title="Generate Captions" onPress={generateCaptions} />
          </View>
        </>
      ) : (
        <Text>No image selected</Text>
      )}
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
  buttonContainer: {
    marginTop: 20, 
  },
});
