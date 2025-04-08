import { Tabs } from "expo-router";
import HomeFillIcon from "../../assets/icons/HomeFillIcon";
import HomeStrokeIcon from "../../assets/icons/HomeStrokeIcon";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            focused ? <HomeFillIcon /> : <HomeStrokeIcon />,
        }}
      />
      <Tabs.Screen
        name="createVideo"
        options={{
          tabBarLabel: "Add Video",
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          tabBarLabel: "Subscription",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "Settings",
        }}
      />
    </Tabs>
  );
}
