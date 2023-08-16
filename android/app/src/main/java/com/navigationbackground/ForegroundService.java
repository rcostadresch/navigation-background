package com.navigationbackground;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;

import java.util.Random;

public class ForegroundService extends Service {

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        NotificationManager notificationManager =
                (NotificationManager) getApplicationContext().getSystemService(NOTIFICATION_SERVICE);


        Class mainActivityClass = getMainActivityClass(getApplicationContext());

        Intent notificationIntent = new Intent(getApplicationContext(),mainActivityClass);

        PendingIntent pendingIntent = PendingIntent.getActivity(getApplicationContext(), 0, notificationIntent,
                (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) ? (PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT) : PendingIntent.FLAG_UPDATE_CURRENT);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            createNotificationChannel();


            Random rand = new Random();
            Integer notificationId = rand.nextInt(9999);

            Notification notification = new NotificationCompat.Builder(getApplicationContext(), "channelId")
                    .setContentTitle("Headless Foreground Service")
                    .setContentText("This is a test for the CKL bakery!")
                    .setContentIntent(pendingIntent)
                    .setSmallIcon(R.mipmap.ic_launcher)
                            .build();

            notificationManager.notify(notificationId , notification);


            startForeground(notificationId, notification);
            startHeadlessTaskService();
        }

        return START_NOT_STICKY;

    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        stopForeground(true);
        stopSelf();
        stopHeadlessTaskService();
        super.onTaskRemoved(rootIntent);
    }

    private void startHeadlessTaskService(){
        Bundle extras = new Bundle();
        extras.putString("CKL", "Bakery");

        Intent intent = new Intent(getApplicationContext(), HeadlessTaskService.class);
        intent.putExtras(extras);


        getApplicationContext().startService(intent);
        HeadlessTaskService.acquireWakeLockNow(getApplicationContext());
    }

    private void stopHeadlessTaskService(){
        Intent intent = new Intent(getApplicationContext(), HeadlessTaskService.class);
        getApplicationContext().stopService(intent);
    }

    @RequiresApi(Build.VERSION_CODES.O)
    void createNotificationChannel() {
        String description = "channelDescription";
        int importance = NotificationManager.IMPORTANCE_DEFAULT;
        NotificationChannel channel = new NotificationChannel("channelId", "channelName", importance);
        channel.setDescription(description);
        channel.enableLights(true);
        channel.setLightColor(Color.BLUE);

        NotificationManager notificationManager =
                (NotificationManager) getApplicationContext().getSystemService(NOTIFICATION_SERVICE);

        notificationManager.createNotificationChannel(channel);

    }

    private Class getMainActivityClass(Context context) {
        String packageName = context.getPackageName();
        Intent launchIntent = context.getPackageManager().getLaunchIntentForPackage(packageName);
        if (launchIntent == null || launchIntent.getComponent() == null) {
            return null;
        }
        try {
            return Class.forName(launchIntent.getComponent().getClassName());
        } catch (ClassNotFoundException e) {
            return null;
        }
    }
}
