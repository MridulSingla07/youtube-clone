import * as ImagePicker from "expo-image-picker";
import { Button, Image, View, Alert } from "react-native";
import { useState } from "react";

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Check current permission status first
    const { status: existingStatus } =
      await ImagePicker.getMediaLibraryPermissionsAsync();

    // Only ask if permissions haven't been determined yet
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      finalStatus = status;
    }

    // Now check if we have permission
    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission required",
        "We need access to your camera roll, boss."
      );
      return;
    }

    // Let user pick an image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      console.log("User said nope");
    }
  };
  return (
    <View>
      <Button title="Upload Image" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, marginTop: 10 }}
        />
      )}
    </View>
  );
}
