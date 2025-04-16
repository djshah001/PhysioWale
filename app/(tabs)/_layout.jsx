import React from "react";
import { Tabs } from "expo-router";
import TabBarComp from "../../components/TabNav/TabBarComp";
import { tabScreenOptions } from "../../constants/navigationConfig";

const TabsLayout = () => {
  return (
    <>
      <Tabs
        tabBar={(props) => <TabBarComp {...props} />}
        screenOptions={tabScreenOptions}
        // // This tells Expo Router to preserve the active tab when navigating back
        // // It will remember which tab was active and return to it
        // initialRouteName="home"
        // backBehavior="history"

      >
        <Tabs.Screen
          name="home"
          options={{ title: "Home", icon: "home-outline", focusedIcon: "home" }}
        />

        {/* Rest of your tabs remain unchanged */}
        <Tabs.Screen
          name="workouts"
          options={{
            title: "Workouts",
            icon: "barbell-outline",
            focusedIcon: "barbell",
          }}
        />

        {/* <Tabs.Screen
          name="Clinic"
          options={{
            title: "Clinic",
            icon: "medkit-outline",
            focusedIcon: "medkit",
          }}
        /> */}

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            icon: "person-outline",
            focusedIcon: "person",
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
