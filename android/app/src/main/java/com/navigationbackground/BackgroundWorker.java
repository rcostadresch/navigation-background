package com.navigationbackground;

import android.content.Context;
import android.content.Intent;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

public class BackgroundWorker extends Worker {
    private final Context context;

    public BackgroundWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.context = context;
    }

    @NonNull
    @Override
    public Result doWork() {
        Intent intent = new Intent(this.context, ForegroundService.class);
        this.context.startService(intent);

        return Result.success();
    }
}