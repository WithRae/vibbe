<?php

namespace App\Console\Commands;

use App\Services\StreakService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class RefillMercyTokens extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'mercy:refill';

    /**
     * The console command description.
     */
    protected $description = 'Refill mercy tokens to 3 for all users who have used tokens. Runs on the 1st of each month.';

    public function __construct(private readonly StreakService $streakService) 
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Only run on the 1st of the month (UTC)
        if (Carbon::now('UTC')->day !== 1) {
            $this->info('Not the 1st of the month. Skipping mercy token refill.');
            return Command::SUCCESS;
        }

        $count = $this->streakService->refillAllMercyTokens();

        $this->info("Mercy tokens refilled for {$count} user(s).");

        return Command::SUCCESS;
    }
}