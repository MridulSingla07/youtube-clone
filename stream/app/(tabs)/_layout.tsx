import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
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
