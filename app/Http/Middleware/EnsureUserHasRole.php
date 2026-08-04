<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            abort(403, 'This action requires a '.implode(' or ', $roles).' account.');
        }

        if ($user->role === 'customer' && in_array('customer', $roles, true)) {
            $user->loadMissing('customer');
            if ($user->customer?->suspended_at !== null) {
                abort(403, 'Your account has been suspended. Please contact support.');
            }
        }

        return $next($request);
    }
}
