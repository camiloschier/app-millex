import React, {useState} from 'react';
import { StyleSheet, View, WebView } from 'react-native';
import Login from './components/Login';
import Landing from './components/Landing';
import { AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const fetchFonts = () => {
  return Font.loadAsync({
  'raleway-light': require('./assets/fonts/Raleway-Light.ttf'),
  
  });
  };

export default function App() {
    const [dataLoaded, setDataLoaded] = useState(false)
    
    if(!dataLoaded){
      return (
        < AppLoading
          startAsync={fetchFonts}
          onFinish={() => setDataLoaded(true)}
        />
        );
    }
    return (
      < Landing/>
      );
  
  
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
