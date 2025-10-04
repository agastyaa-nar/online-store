<?php
function loadEnv(string $path): void
{
    if (!file_exists($path)) {
        throw new Exception(".env file not found at $path");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);

        // Lewati baris kosong atau komentar
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        // Pastikan baris valid (mengandung "=")
        if (!str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        // Hilangkan tanda kutip kalau ada
        $value = trim($value, "\"'");

        // Simpan ke environment global
        $_ENV[$key] = $value;
        putenv("$key=$value");
    }
}
