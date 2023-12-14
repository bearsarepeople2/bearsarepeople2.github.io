<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Lazer</title>

    @vite(['resources/css/app.css', 'resources/js/index.ts'])
</head>

<body id="app">
    @yield('content')
</body>

</html>
