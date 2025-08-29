<?php
require_once 'config.php';

// Initialize database on first run
initDatabase();

// Serve static files
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

// Remove query string
$path = strtok($path, '?');

// Route handling
switch($path) {
    case '/':
    case '/index.html':
        serveFile('index.html');
        break;
    
    case '/auth.html':
        serveFile('auth.html');
        break;
    
    case '/admin.html':
        serveFile('admin.html');
        break;
    
    case '/login.html':
        serveFile('login.html');
        break;
    
    default:
        // Serve static files (CSS, JS, etc.)
        $filename = ltrim($path, '/');
        if (file_exists($filename)) {
            serveFile($filename);
        } else {
            http_response_code(404);
            echo "File not found";
        }
}

function serveFile($filename) {
    if (!file_exists($filename)) {
        http_response_code(404);
        echo "File not found";
        return;
    }
    
    $extension = pathinfo($filename, PATHINFO_EXTENSION);
    
    switch($extension) {
        case 'css':
            header('Content-Type: text/css');
            break;
        case 'js':
            header('Content-Type: application/javascript');
            break;
        case 'html':
            header('Content-Type: text/html');
            break;
        default:
            header('Content-Type: text/plain');
    }
    
    readfile($filename);
}
?>