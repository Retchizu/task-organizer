import { StyleSheet, Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Button } from "@rneui/base";
import { useRouter } from "expo-router";
import { useFonts } from "expo-font";
import { refreshToken as refreshTokenMethod } from "../task-methods/auth-methods/refreshToken";
import { useUserContext } from "../context/UserContext";
import { getUser } from "../task-methods/auth-methods/logInUser";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const App = () => {
  const [loaded] = useFonts({
    "Inconsolata-ExtraBold": require("../assets/fonts/Inconsolata-ExtraBold.ttf"),
    "Inconsolata-SemiBold": require("../assets/fonts/Inconsolata-Black.ttf"),
    "Inconsolata-Regular": require("../assets/fonts/Inconsolata-Regular.ttf"),
    "Inconsolata-Medium": require("../assets/fonts/Inconsolata-Medium.ttf"),
    "Inconsolata-Light": require("../assets/fonts/Inconsolata-Light.ttf"),
    "Inconsolata-ExtraLight": require("../assets/fonts/Inconsolata-ExtraLight.ttf"),
    "Inconsolata-Bold": require("../assets/fonts/Inconsolata-Bold.ttf"),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signUser, user } = useUserContext();
  const autoLogIn = async () => {
    try {
      setIsLoading(true);
      let refreshTokenResult;

      const userResult = await getUser();

      if (userResult === 401) {
        refreshTokenResult = await refreshTokenMethod();
        if (refreshTokenResult === 401 || refreshTokenResult === 500) {
          console.log("Session expired or unauthorized, Log in again");
          SecureStore.deleteItemAsync("accessToken");
          SecureStore.deleteItemAsync("refreshToken");
          router.replace("authentication/logIn");
          return;
        }
      }

      signUser(userResult);
      setIsLoading(false);
      return;
    } catch (error) {
      console.log("Error:", (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    autoLogIn();
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("(drawer)/(home)/pending");
      console.log("User is now setted");
    }
  }, [user]);

  if (!loaded) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Welcome To Retchi's To Do List!</Text>

      <Button
        title={"Click here to get started!"}
        buttonStyle={styles.welcomeButton}
        onPress={() => router.push("/authentication/logIn")}
        loading={isLoading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeMessage: {
    fontFamily: "Inconsolata-ExtraBold",
    fontSize: wp(5.5),
    marginBottom: hp(3),
    textAlign: "center",
  },
  welcomeButton: {
    borderRadius: wp(3),
    backgroundColor: "#787878",
  },
});

export default App;
