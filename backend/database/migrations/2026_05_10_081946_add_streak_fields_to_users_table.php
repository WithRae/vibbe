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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedInteger('login_streak')->default(0)->after('profile_completed');
            $table->unsignedInteger('longest_streak')->default(0)->after('login_streak');
            $table->unsignedInteger('pre_break_streak')->default(0)->after('longest_streak');
            $table->date('last_login_date')->nullable()->after('pre_break_streak');
            $table->unsignedTinyInteger('mercy_tokens')->default(3)->after('last_login_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'login_streak',
                'longest_streak',
                'pre_break_streak',
                'last_login_date',
                'mercy_tokens',
            ]);
        });
    }
};