import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';

import CreateItemScreen from '@/screens/CreateItemScreen';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistryScreen from './src/screens/RegistryScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator 
        initialRouteName="Login"
        >
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registry" component={RegistryScreen} />
        </Stack.Group>

        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Mi lista de compras',
            headerStyle: {
            backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        <Stack.Screen 
          name="CreateItem" 
          component={CreateItemScreen} 
          options={{ 
            title: 'Nuevo producto',
            headerStyle: {
            backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }} 
        />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}