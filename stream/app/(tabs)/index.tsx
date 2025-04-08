import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Video } from "expo-av";
import { COLORS_THEME_1 } from "../../constants/colors";

interface Owner {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverimage: string;
}

interface SingleVideo {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: Owner[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface VideoApiResponse {
  statusCode: number;
  data: {
    docs: SingleVideo[];
  };
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export default function App() {
  const [videos, setVideos] = useState<SingleVideo[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videoList = await fetch("http://localhost:8000/api/v1/videos");
        const response = (await videoList.json()) as VideoApiResponse;
        const data = response.data.docs;
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);
  return (
    <ScrollView style={styles.container}>
      {videos?.map((item, index: any) => {
        // return <Text>{JSON.stringify(item)}</Text>;
        return (
          <Video
            source={{ uri: item.videoFile }}
            style={styles.video}
            useNativeControls
            isLooping
            shouldPlay
            key={index}
          />
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: COLORS_THEME_1.background,
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 180,
    marginBottom: 20,
  },
});
