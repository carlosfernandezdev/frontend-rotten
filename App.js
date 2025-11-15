import { StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'react-native-web';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './app/userPages/Login';
import Register from './app/userPages/Register';
import Profile from './app/userPages/Profile';
import ForgotPassword from './app/userPages/ForgotPassword';
import Home from './app/Home';
import WatchListScreen from './app/watchListScreen';

const Stack = createStackNavigator();


  export default function App() {
      return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark-content" />
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="WatchList" component={WatchListScreen} />
            </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
      );
      }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
