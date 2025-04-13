import React from "react";
import { TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { COLORS_THEME_1 } from "../constants/colors";
import { FontStyles, ThemeText } from "./ThemeText";
import { MaterialIcons } from "@expo/vector-icons";

interface VideoTileProps {
  thumbnail: string;
  title: string;
  duration: number;
  views: number;
  createdAt: string;
  avatar: string;
  ownerName: string;
  onClick: () => void;
}

export default function HomePageVideoTile({
  thumbnail,
  title,
  duration,
  views,
  createdAt,
  avatar,
  ownerName,
  onClick,
}: VideoTileProps) {
  // Format video duration from seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Format view count with comma separation or "K" suffix
  const formatViews = (views: number) => {
    if (views < 1000) return views.toString();
    return `${(views / 1000).toFixed(1)}K`;
  };

  // Format date to show time elapsed since upload
  const formatUploadDate = (dateString: string) => {
    const uploadDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <TouchableOpacity style={styles.videoCard} onPress={onClick}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.durationBadge}>
          <ThemeText color="white">{formatDuration(duration)}</ThemeText>
        </View>
      </View>

      <View style={styles.videoDetails}>
        <Image source={{ uri: avatar }} style={styles.avatar} />

        <View style={styles.infoContainer}>
          <ThemeText numberOfLines={2} fontFamily={FontStyles.WorkSans_Medium}>
            {title}
          </ThemeText>

          <ThemeText>{ownerName}</ThemeText>

          <View style={styles.statsContainer}>
            <ThemeText>
              {formatViews(views)} views • {formatUploadDate(createdAt)}
            </ThemeText>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={20} color="#888" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  videoCard: {
    marginBottom: 16,
    marginHorizontal: 8,
  },
  thumbnailContainer: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  videoDetails: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: COLORS_THEME_1.videoDetails,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreButton: {
    padding: 4,
  },
});
