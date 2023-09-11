/* eslint-disable react-native/no-inline-styles */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import Geolocation from '@react-native-community/geolocation';
import { Button, NativeModules } from 'react-native';

import React, { useCallback, useEffect } from 'react';
import {
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
  useColorScheme,
} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const watchDevicePosition = () => {
    Geolocation.watchPosition(
      position => {
        console.log(Date.now(), position);
      },
      error => console.error(error.message),
      {
        enableHighAccuracy: true,
        timeout: 1500,
        maximumAge: 0,
        distanceFilter: 5,
      },
    );
  };

  const requestAndroidLocationPermission = useCallback(async () => {
    const grantedFineLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    const grantedBackgroundLocation = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
    );

    if (
      grantedFineLocation === PermissionsAndroid.RESULTS.GRANTED &&
      grantedBackgroundLocation === PermissionsAndroid.RESULTS.GRANTED
    ) {
      NativeModules.BackgroundWorkManager.startBackgroundWork();
    } else {
      console.error('Request for location permission was denied by user');
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization();
      watchDevicePosition();
    } else {
      requestAndroidLocationPermission();
    }
  }, [requestAndroidLocationPermission]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Button
          onPress={() => {
            NativeModules.BackgroundWorkManager.startBackgroundWork();
          }}
          title="Start background service"
          color="green"
        />

        <View style={{ marginTop: 10 }}>
          <Button
            onPress={() => {
              NativeModules.BackgroundWorkManager.stopBackgroundWork();
              Geolocation.stopObserving();
            }}
            title="Stop background service"
            color="red"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
