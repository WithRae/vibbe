<?php

use App\Console\Commands\RefillMercyTokens;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Commands
|--------------------------------------------------------------------------
|
| RefillMercyTokens runs daily at UTC midnight.
| The command itself guards against running on non-1st days,
| so scheduling daily is safe and means no cron drift issues.
|
*/

Schedule::command(RefillMercyTokens::class)->dailyAt('00:00');