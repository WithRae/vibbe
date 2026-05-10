<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    // GET /tasks
    public function index(Request $request): JsonResponse
    {
        $tasks = $request->user()
            ->tasks()
            ->with('microtasks')
            ->orderBy('order')
            ->orderBy('created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $tasks,
        ]);
    }

    // POST /tasks
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $task = $request->user()->tasks()->create([
            'title'     => $request->title,
            'xp_reward' => 50,
            'order'     => $request->user()->tasks()->count(),
        ]);

        $task->load('microtasks');

        return response()->json([
            'success' => true,
            'data'    => $task,
        ], 201);
    }

    // PATCH /tasks/{task}/complete
    public function toggleComplete(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTask($request, $task);

        $task->update(['completed' => !$task->completed]);

        return response()->json([
            'success' => true,
            'data'    => $task->fresh('microtasks'),
        ]);
    }

    // DELETE /tasks/{task}
    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->authorizeTask($request, $task);

        $task->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted.',
        ]);
    }

    private function authorizeTask(Request $request, Task $task): void
    {
        abort_if($task->user_id !== $request->user()->id, 403, 'Forbidden.');
    }
}