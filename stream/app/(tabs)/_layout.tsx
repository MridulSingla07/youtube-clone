import { Tabs } from "expo-router";
import HomeFillIcon from "../../assets/icons/HomeFillIcon";
import HomeStrokeIcon from "../../assets/icons/HomeStrokeIcon";
import { COLORS_THEME_1 } from "../../constants/colors";
import { View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS_THEME_1.tabIconsFill,
        tabBarInactiveTintColor: COLORS_THEME_1.tabIconsStroke,
        tabBarStyle: { backgroundColor: COLORS_THEME_1.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color={
                focused
                  ? COLORS_THEME_1.tabIconsFill
                  : COLORS_THEME_1.tabIconsStroke
              }
            />
            // <View>
            //   <HomeFillIcon
            //     color={
            //       focused
            //         ? COLORS_THEME_1.tabIconsFill
            //         : COLORS_THEME_1.tabIconsStroke
            //     }
            //   />
            // </View>
          ),
        }}
      />
      <Tabs.Screen
        name="createVideo"
        options={{
          tabBarLabel: "Add Video",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="circle-with-plus"
              size={24}
              color={
                focused
                  ? COLORS_THEME_1.tabIconsFill
                  : COLORS_THEME_1.tabIconsStroke
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          tabBarLabel: "Subscription",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="folder-video"
              size={24}
              color={
                focused
                  ? COLORS_THEME_1.tabIconsFill
                  : COLORS_THEME_1.tabIconsStroke
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={24}
              color={
                focused
                  ? COLORS_THEME_1.tabIconsFill
                  : COLORS_THEME_1.tabIconsStroke
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="settings"
              size={24}
              color={
                focused
                  ? COLORS_THEME_1.tabIconsFill
                  : COLORS_THEME_1.tabIconsStroke
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
