<?php

$path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
if (!is_string($path) || !preg_match('~^/blog/([^/]+)/?$~D', $path, $matches)) {
    http_response_code(404);
    exit;
}

$html = file_get_contents(__DIR__ . '/index.html');
if ($html === false) {
    error_log('OGP: index.html could not be read');
    http_response_code(500);
    exit;
}

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache');

$settingsJson = @file_get_contents(__DIR__ . '/ogp-settings.json');
$cacheJson = @file_get_contents(__DIR__ . '/ogp-cache.json');
$settings = $settingsJson === false ? null : json_decode($settingsJson, true);
$cache = $cacheJson === false ? null : json_decode($cacheJson, true);
if (!is_array($settings) || !isset($settings['site']) || !is_array($cache) || !isset($cache['titles']) || !is_array($cache['titles'])) {
    error_log('OGP: settings or cache is missing or invalid');
    echo $html;
    exit;
}

$key = rawurldecode($matches[1]);
if (!isset($cache['titles'][$key]) || !is_string($cache['titles'][$key])) {
    echo $html;
    exit;
}

$site = $settings['site'];
foreach (['title', 'url', 'description', 'image', 'locale', 'twitterCard'] as $field) {
    if (!isset($site[$field]) || !is_string($site[$field])) {
        error_log('OGP: site settings are invalid');
        echo $html;
        exit;
    }
}

$escape = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$title = $cache['titles'][$key] . ' | ' . $site['title'];
$url = $site['url'] . $path;
$tags = '<title data-initial-ogp>' . $escape($title) . '</title>' . "\n";
$tags .= '<meta data-initial-ogp name="description" content="' . $escape($site['description']) . '">' . "\n";
$tags .= '<link data-initial-ogp rel="canonical" href="' . $escape($url) . '">' . "\n";
foreach ([
    'og:site_name' => $site['title'],
    'og:locale' => $site['locale'],
    'og:type' => 'article',
    'og:title' => $title,
    'og:description' => $site['description'],
    'og:url' => $url,
    'og:image' => $site['image'],
] as $property => $value) {
    $tags .= '<meta data-initial-ogp property="' . $property . '" content="' . $escape($value) . '">' . "\n";
}
foreach ([
    'twitter:card' => $site['twitterCard'],
    'twitter:title' => $title,
    'twitter:description' => $site['description'],
    'twitter:image' => $site['image'],
] as $name => $value) {
    $tags .= '<meta data-initial-ogp name="' . $name . '" content="' . $escape($value) . '">' . "\n";
}

$result = preg_replace_callback('~<title\b[^>]*>.*?</title>~is', static fn() => $tags, $html, 1, $count);
if ($result === null || $count !== 1) {
    error_log('OGP: index.html has no title element');
    echo $html;
    exit;
}
echo $result;
