<?php
/**
 * Environment Variables Loader
 * Simple environment variable loader for Railway
 */

function loadEnv(string $path): void
{
    if (!file_exists($path)) {
        return; // Silently fail if .env doesn't exist (Railway uses environment variables)
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);

        // Skip empty lines or comments
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        // Skip invalid lines
        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        // Remove quotes if present
        $value = trim($value, "\"'");

        // Set environment variable
        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}
?>
