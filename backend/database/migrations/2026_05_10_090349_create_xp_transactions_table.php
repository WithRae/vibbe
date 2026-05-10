<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('xp_transactions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Positive = earned, negative = penalty (future use)
            $table->integer('amount');

            // Where this XP came from
            $table->enum('source', [
                'streak_milestone',
                'task_completed',
                'microtask_completed',
                'focus_session',
                'bonus',
                'manual',
                'penalty',
            ]);

            // Optional reference to the originating record (task id, session id, etc.)
            $table->unsignedBigInteger('source_id')->nullable();

            // Extra context — milestone days, task priority, session duration, etc.
            $table->json('meta')->nullable();

            $table->timestamps();

            // Indexes for common queries
            $table->index(['user_id', 'created_at']);
            $table->index(['user_id', 'source']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('xp_transactions');
    }
};