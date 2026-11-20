<?php

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit;
}

function fetchJson(string $url): array
{
    $curl = curl_init($url);
    if ($curl === false) {
        throw new RuntimeException('cURL initialization failed');
    }
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    $body = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);
    if ($body === false || $status !== 200) {
        throw new RuntimeException("API request failed (HTTP $status): $error");
    }
    $data = json_decode($body, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($data)) {
        throw new RuntimeException('API response is not an object');
    }
    return $data;
}

function collectTitles(string $baseUrl, callable $fetch): array
{
    $countResponse = $fetch($baseUrl . '/count');
    $expected = $countResponse['data']['count'] ?? null;
    if (!is_int($expected) || $expected < 0) {
        throw new RuntimeException('Invalid content count');
    }

    $titles = [];
    for ($page = 0; count($titles) < $expected; $page++) {
        $response = $fetch($baseUrl . '?page=' . $page . '&rows=10');
        $items = $response['data'] ?? null;
        if (!is_array($items) || !array_is_list($items) || count($items) === 0 || count($items) > 10) {
            throw new RuntimeException('Invalid content list');
        }
        foreach ($items as $item) {
            if (!is_array($item) || !isset($item['key'], $item['title']) ||
                !is_string($item['key']) || $item['key'] === '' ||
                !is_string($item['title']) || ($item['status'] ?? null) !== 'published' ||
                array_key_exists($item['key'], $titles)) {
                throw new RuntimeException('Invalid or duplicate content');
            }
            $titles[$item['key']] = $item['title'];
        }
    }
    $finalCount = $fetch($baseUrl . '/count');
    if (count($titles) !== $expected || ($finalCount['data']['count'] ?? null) !== $expected) {
        throw new RuntimeException('Content count changed while updating');
    }
    return $titles;
}

function updateCache(string $directory, callable $fetch): int
{
    $settings = json_decode(file_get_contents($directory . '/ogp-settings.json'), true, 512, JSON_THROW_ON_ERROR);
    $siteKey = $settings['site']['key'] ?? null;
    $postType = $settings['postType'] ?? null;
    if (!is_string($siteKey) || $siteKey === '' || !is_string($postType) || $postType === '') {
        throw new RuntimeException('Invalid OGP settings');
    }
    $url = 'https://writers.hyperdb.cloud/api/v1/sites/' . rawurlencode($siteKey) .
        '/contents/' . rawurlencode($postType);
    $titles = collectTitles($url, $fetch);
    $json = json_encode(['titles' => (object) $titles], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    $temporary = tempnam($directory, '.ogp-');
    if ($temporary === false) {
        throw new RuntimeException('Could not create temporary cache');
    }
    try {
        if (file_put_contents($temporary, $json) !== strlen($json)) {
            throw new RuntimeException('Could not write temporary cache');
        }
        if (!chmod($temporary, 0644)) {
            throw new RuntimeException('Could not set cache permissions');
        }
        if (!rename($temporary, $directory . '/ogp-cache.json')) {
            throw new RuntimeException('Could not replace OGP cache');
        }
    } finally {
        if (file_exists($temporary)) {
            unlink($temporary);
        }
    }
    return count($titles);
}

if (realpath($_SERVER['SCRIPT_FILENAME'] ?? '') === __FILE__) {
    $lock = null;
    try {
        $lock = fopen(__DIR__ . '/.ogp-update.lock', 'c');
        if ($lock === false || !flock($lock, LOCK_EX | LOCK_NB)) {
            throw new RuntimeException('Could not acquire update lock');
        }
        $count = updateCache(__DIR__, 'fetchJson');
        fwrite(STDOUT, "OGP cache updated: $count articles\n");
    } catch (Throwable $error) {
        fwrite(STDERR, 'OGP update failed: ' . $error->getMessage() . "\n");
        exit(1);
    } finally {
        if (is_resource($lock)) {
            fclose($lock);
        }
    }
}
