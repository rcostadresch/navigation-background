import Geolocation from '@react-native-community/geolocation';

const HeadlessTask = async (taskData: unknown): Promise<void> => {
  console.log('## Hey this is a headless JS task ##', taskData);

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

export default HeadlessTask;
