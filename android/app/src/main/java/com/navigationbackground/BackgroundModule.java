package com.navigationbackground;

import android.content.Context;
import android.content.Intent;

import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

public class BackgroundModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "BackgroundWorkManager";

    private final Context mContext;
    private final OneTimeWorkRequest workRequest;

    public BackgroundModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        workRequest = new OneTimeWorkRequest.Builder(BackgroundWorker.class).build();
    }

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

    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }
}