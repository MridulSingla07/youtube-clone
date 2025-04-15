import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  FlatList,
} from "react-native";
import { COLORS_THEME_1 } from "../../constants/colors";
import { FontStyles, ThemeText } from "../../components/ThemeText";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import HomePageVideoTile from "../../components/HomePageVideoTile";

const { width } = Dimensions.get("window");

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const videoList = await fetch("http://localhost:8000/api/v1/videos");
        const response = (await videoList.json()) as VideoApiResponse;
        const data = response.data.docs;
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoPress = (videoId: string) => {
    // Navigation to video detail page would go here
    console.log(`Navigate to video ${videoId}`);
    // router.push(`/video/${videoId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="stream" size={24} color="black" />
          <ThemeText
            fontFamily={FontStyles.WorkSans_Bold}
            style={styles.logoText}
            color="#000"
            fontSize={20}
          >
            STREAM
          </ThemeText>
        </View>
        {/* <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View> */}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemeText>Loading videos...</ThemeText>
        </View>
      ) : videos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ThemeText>No videos available</ThemeText>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={videos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <HomePageVideoTile
                thumbnail={item.thumbnail}
                title={item.title}
                duration={item.duration}
                views={item.views}
                createdAt={item.createdAt}
                avatar={item.owner[0].avatar}
                ownerName={item.owner[0].fullname}
                onClick={() => handleVideoPress(item._id)}
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS_THEME_1.background || "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoText: {
    marginLeft: 10,
    letterSpacing: 3,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});
