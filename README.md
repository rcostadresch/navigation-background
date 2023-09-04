# Navigation Background

This README will pass through all the main concepts of the implementation of collecting `Geolocation from Device` on `Background` in both `Android` and `iOS` for React Native.

It uses the following tools:

- [React Native](https://reactnative.dev/)
- [@react-native-community/geolocation](https://github.com/michalchudziak/react-native-geolocation) library


- Android:
   - [Headless JS](https://reactnative.dev/docs/headless-js-android) (from RN)
   - [Work Manager](https://developer.android.com/topic/libraries/architecture/workmanager
)
   - [Service](https://developer.android.com/guide/components/services
)

---

### Summary

* [`Walk-through: Android`](#walkthrough-android)
* [`Walk-through: iOS`](#walkthrough-ios)

---

## Walkthrough: Android

### Step 1 - Registering the Task: 

Register the `HeadlessTask` following the documentation on the root of the RN project. In our case, at `index.js` on the next line after registering the `App` main component.

```
AppRegistry.registerHeadlessTask('HeadlessTask', () =>  require('HeadlessTask').default);
```


**ATTENTION** to the name of the task. It can be anything. But for this project the name is **`HeadlessTask`**.

### Step 2 - Creating the Task file: 

Create the file of the task. On this project is located and named here: `src/HeadlessTask.jsx`. This file **needs** to have the same name we already chose in Step 1. That is the file containing the code that will be triggered from the `Android Service`.

### Step 3 - Headless Task Service: 

The files for triggering the Work Manager, Service, and HeadlessTask will be located at `android/app/src/main/java/com/navigationbackground`.

Setting up the `HeadlessTaskService.java`:

```
...
@Override
protected @Nullable
HeadlessJsTaskConfig getTaskConfig(Intent intent) {
  Bundle extras = intent.getExtras();
  if (extras != null) {
      return new HeadlessJsTaskConfig(
              "HeadlessTask",
              Arguments.fromBundle(extras),
              5000,
              true
      );
  }
  return null;
}
...
```

**ATTENTION** to the name of the task. It's the same already mentioned for this project. 

### Step 4 - Foreground Service: 

By default, the `HeadlessTask` will stay active while there is a service running on the app. Unfortunately, if we only trigger the `HeadlessTask` it will finish his code process and then end the service. So, our strategy for this use case is to maintain a `Foreground Service` running during the app execution even when it's on `Background` to avoid the interrupt of our `HeadlessTask`.

The project setup for the `ForegroundService.java` is pretty similar to any other implementation of `Services` on Android (following the documentation). The main difference is our `Foreground Service` is now responsible for starting the `HeadlessTaskService` with this command:

```
...
startHeadlessTaskService();
...
```

Function detailed:

```
...
private void startHeadlessTaskService(){
  Bundle extras = new Bundle();
  extras.putString("CKL", "Bakery");

  Intent intent = new Intent(getApplicationContext(), HeadlessTaskService.class);
  intent.putExtras(extras);


  getApplicationContext().startService(intent);
  HeadlessTaskService.acquireWakeLockNow(getApplicationContext());
}
...
```

### Step 5 - Work Manager:

For education only, the project starts our `Foreground Service` using the `Work Manager` tool. For this, we created two required files: `BackgroundModule.java` and `BackgroundWorker.java`. An important concept of the work manager is that requires a `Work` for each  `Work Request` that is dispatched. Our worker will be responsible for starting the `ForegroundService` on the app. Snippet: 

```
...
@NonNull
@Override
public Result doWork() {
  Intent intent = new Intent(this.context, ForegroundService.class);
  this.context.startService(intent);

  return Result.success();
}
...
```

And the `BackgroundModule.java` has the methods that will be called from the `React Native` side. Which are:  `startBackgroundWork()` and `stopBackgroundWork()`. Both use the Work Manager to handle our flow and start/stop the Worker. 

```
...
@ReactMethod
public void startBackgroundWork() {
  WorkManager.getInstance(mContext).enqueueUniqueWork("testWork", ExistingWorkPolicy.KEEP, workRequest);
}

@ReactMethod
public void stopBackgroundWork() {
  WorkManager.getInstance(mContext).cancelUniqueWork("testWork");
  Intent foregroundService = new Intent(mContext, ForegroundService.class);
  mContext.stopService(foregroundService);
}
...
```

### Step 6 - Background Package for RN:

Now, for React Native to be able to access the methods created on the Native Android is necessary to create the `BackgroundPackage.java` and add this package on the `MainApplication.java` at this part:

```
...
@Override
protected List<ReactPackage> getPackages() {
 @SuppressWarnings("UnnecessaryLocalVariable")
 List<ReactPackage> packages = new PackageList(this).getPackages();
 // Packages that cannot be autolinked yet can be added manually here, for example:
 // packages.add(new MyReactNativePackage());
   packages.add(new BackgroundPackage());
 return packages;
}
...
```

### Step 7 - React Native trigger:

With all created and configured it is important not miss to add the necessary permissions on the `AndroidManifest.xml`:

```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```

Finally, the `App.tsx` must request the permissions from the user, and then according to the app-designed flow, call `NativeModules.BackgroundWorkManager.startBackgroundWork()`. This method will trigger directly the Work Manager and make the engine run as expected.

---

## Walkthrough: iOS

For the iOS it's only needed to add the desired capabilities on `Xcode` or directly on the `Info.plist`. Which are:

```
<key>UIBackgroundModes</key>
<array>
   <string>location</string>
</array>
```

And also, type the purpose description of using the device' Location on Background:

```
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app uses location while in use</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app uses location while in use</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>This app uses location while in use</string>
```

Finally, the `App.tsx` must request the permissions from the user, and then according to the app-designed flow, call `Geolocation.watchPosition()` (library method) 
