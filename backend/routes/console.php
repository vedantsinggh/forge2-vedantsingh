<?php

use App\Services\SlaService;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function (SlaService $slaService) {
    $slaService->checkBreaches();
})->hourly();
