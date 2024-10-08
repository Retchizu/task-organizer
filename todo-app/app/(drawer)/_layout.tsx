import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomDrawerComponent from "../../components/CustomDrawerComponent";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { TouchableOpacity, View } from "react-native";
import { useAddTaskModalContext } from "../../context/AddTaskModalContext";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Badge } from "@rneui/base";
import { useEffect, useState } from "react";
import { useNotificationModalContext } from "../../context/NotificationModalContext";
import { useNotifcationContext } from "../../context/NotificationContext";

const DrawerLayout = () => {
  const { toggleAddVisible } = useAddTaskModalContext();
  const { toggleNotificationModalVisibility } = useNotificationModalContext();
  const route = useRoute();
  const router = useRouter();
  const [notificationValue, setNotificationValue] = useState(0);
  const { notificationList } = useNotifcationContext();

  const handleHeaderAddPress = () => {
    if (route.name !== "pending") {
      router.navigate("(home)/pending");
      toggleAddVisible();
    } else {
      toggleAddVisible();
    }
  };

  useEffect(() => {
    setNotificationValue(
      notificationList.filter((noitification) => !noitification.isRead).length
    );
  }, [notificationList]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerComponent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#393E46",
          },
          headerShown: true,
          headerTitleStyle: {
            color: "white",
            fontFamily: "Inconsolata-Medium",
          },
          headerTintColor: "white",
          drawerActiveBackgroundColor: "#EEEEEE",
          drawerLabelStyle: {
            color: "black",
            fontFamily: "Inconsolata-Regular",
            fontSize: hp(2.5),
          },
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{ marginHorizontal: wp(4) }}
                onPress={() => handleHeaderAddPress()}
              >
                <FontAwesome6 name="square-plus" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  marginRight: wp(4),
                  marginLeft: wp(1),
                }}
                onPress={() => toggleNotificationModalVisibility()}
              >
                <FontAwesome6 name="bell" size={24} color="white" />
              </TouchableOpacity>
              {notificationValue > 0 && (
                <Badge
                  value={notificationValue}
                  containerStyle={{
                    position: "absolute",
                    right: wp(2),
                    bottom: hp(1.9),
                  }}
                  badgeStyle={{ backgroundColor: "#929AAB" }}
                />
              )}
            </View>
          ),
        }}
      >
        <Drawer.Screen
          name="(home)"
          options={{
            title: "To Do",

            drawerIcon: () => (
              <FontAwesome6 name="list-check" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="account"
          options={{
            title: "Account",

            drawerIcon: () => (
              <Ionicons name="person" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",

            drawerIcon: () => <Ionicons name="cog" size={24} color="black" />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default DrawerLayout;
