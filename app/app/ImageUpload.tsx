import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { generateCaption } from './utils/captionGenerator';
import { HUGGING_FACE_API_KEY } from '@env';



export default function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const API_KEY = 'YOUR_HUGGING_FACE_API_KEY'; // Replace with your actual Hugging Face API key

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
      setCaption(null); // Clear previous caption
      console.log("Image URI is:", result.assets[0].uri);
    } else {
      console.log("No image selected");
    }
  };

  const generateCaptions = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    setCaption(null); // Clear previous caption while loading
    console.log("Generating captions for image:", image);
    
    try {
      const generatedCaption = await generateCaption(image, API_KEY);
      setCaption(generatedCaption);
      console.log("Caption generated:", generatedCaption);
    } catch (error) {
      console.error("Error generating caption:", error);
      alert("Failed to generate caption.");
    } finally {
      setLoading(false);
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
          {loading ? (
            <>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.caption}>Generating caption...</Text>
            </>
          ) : (
            caption && <Text style={styles.caption}>Caption: {caption}</Text>
          )}
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
  caption: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
