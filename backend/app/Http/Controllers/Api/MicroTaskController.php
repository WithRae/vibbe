<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MicroTask;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MicroTaskController extends Controller
{
    // POST /tasks/{task}/microtasks
    public function store(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTask($request, $task);

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $microtask = $task->microtasks()->create([
            'title'     => $request->title,
            'xp_reward' => 10,
            'order'     => $task->microtasks()->count(),
        ]);

        return response()->json([
            'success' => true,
            'data'    => $microtask,
        ], 201);
    }

    // PATCH /tasks/{task}/microtasks/{microtask}/complete
    public function toggleComplete(Request $request, Task $task, MicroTask $microtask): JsonResponse
    {
        $this->authorizeTask($request, $task);

        abort_if($microtask->task_id !== $task->id, 403, 'Forbidden.');

        $microtask->update(['completed' => !$microtask->completed]);

        // Auto-complete parent task if all microtasks are done
        $total     = $task->microtasks()->count();
        $completed = $task->microtasks()->where('completed', true)->count();

        if ($total > 0 && $total === $completed) {
            $task->update(['completed' => true]);
        }

        return response()->json([
            'success' => true,
            'data'    => $microtask,
            'task_completed' => $total > 0 && $total === $completed,
        ]);
    }

    // DELETE /tasks/{task}/microtasks/{microtask}
    public function destroy(Request $request, Task $task, MicroTask $microtask): JsonResponse
    {
        $this->authorizeTask($request, $task);

        abort_if($microtask->task_id !== $task->id, 403, 'Forbidden.');

        $microtask->delete();

        return response()->json([
            'success' => true,
            'message' => 'Micro-task deleted.',
        ]);
    }

    private function authorizeTask(Request $request, Task $task): void
    {
        abort_if($task->user_id !== $request->user()->id, 403, 'Forbidden.');
    }
}