<?php

require __DIR__ . '/../public/ogp-update.php';

function expect(bool $condition, string $message): void
{
    if (!$condition) {
        throw new RuntimeException($message);
    }
}

$directory = sys_get_temp_dir() . '/hyperdb-ogp-' . bin2hex(random_bytes(8));
if (!mkdir($directory)) {
    throw new RuntimeException('Could not create test directory');
}

try {
    $settings = [
        'site' => [
            'key' => 'site',
            'title' => 'Site',
            'url' => 'https://example.test',
            'description' => 'Description',
            'image' => 'https://example.test/ogp.png',
            'locale' => 'ja_JP',
            'twitterCard' => 'summary_large_image',
        ],
        'postType' => 'post',
    ];
    file_put_contents($directory . '/ogp-settings.json', json_encode($settings));
    file_put_contents($directory . '/index.html', '<html><head><title>Site</title></head><body></body></html>');
    copy(__DIR__ . '/../public/ogp.php', $directory . '/ogp.php');

    $urls = [];
    $fetch = static function (string $url) use (&$urls): array {
        $urls[] = $url;
        if (str_ends_with($url, '/count')) {
            return ['data' => ['count' => 11]];
        }
        parse_str(parse_url($url, PHP_URL_QUERY), $query);
        $page = (int) $query['page'];
        $items = [];
        for ($i = $page * 10; $i < min(($page + 1) * 10, 11); $i++) {
            $items[] = ['key' => 'id' . $i, 'title' => $i === 10 ? 'A & "B"' : 'Title ' . $i, 'status' => 'published'];
        }
        return ['data' => $items];
    };
    expect(updateCache($directory, $fetch) === 11, 'Expected all paginated articles');
    expect(str_contains($urls[1], '?page=0&rows=10') && str_contains($urls[2], '?page=1&rows=10'), 'Expected zero-based pages');
    $cache = file_get_contents($directory . '/ogp-cache.json');

    $render = static function (string $directory, string $uri): string {
        $_SERVER['REQUEST_URI'] = $uri;
        ob_start();
        include $directory . '/ogp.php';
        return ob_get_clean();
    };
    $html = $render($directory, '/blog/id10?page=2');
    expect(str_contains($html, '<title data-initial-ogp>A &amp; &quot;B&quot; | Site</title>'), 'Title should be HTML escaped');
    expect(str_contains($html, 'property="og:url" content="https://example.test/blog/id10"'), 'OGP URL must omit query');
    expect(str_contains($html, 'property="og:type" content="article"'), 'Expected article OGP');
    expect(!str_contains($html, '<title>Site</title>'), 'Initial title should be replaced');

    try {
        updateCache($directory, static function (): array {
            throw new RuntimeException('API failure');
        });
        throw new RuntimeException('API failure should abort the update');
    } catch (RuntimeException $error) {
        expect($error->getMessage() === 'API failure', 'Unexpected update failure');
    }
    expect(file_get_contents($directory . '/ogp-cache.json') === $cache, 'Failed update must preserve cache');

    $empty = static fn(string $url): array => ['data' => ['count' => 0]];
    expect(updateCache($directory, $empty) === 0, 'Empty list should be accepted');
    expect(json_decode(file_get_contents($directory . '/ogp-cache.json'), true)['titles'] === [], 'Removed articles should disappear');
    echo "OGP tests passed\n";
} finally {
    foreach (['ogp-settings.json', 'index.html', 'ogp.php', 'ogp-cache.json'] as $file) {
        if (file_exists($directory . '/' . $file)) {
            unlink($directory . '/' . $file);
        }
    }
    rmdir($directory);
}
