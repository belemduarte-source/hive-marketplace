$root = $PSScriptRoot
$port = 9091

$endpoint = New-Object System.Net.IPEndPoint([System.Net.IPAddress]::Loopback, $port)
$listener = New-Object System.Net.Sockets.TcpListener($endpoint)
$listener.Start()
Write-Host "Hive frontend on http://localhost:${port}"
[Console]::Out.Flush()

function Get-MimeType($ext) {
    switch ($ext.ToLower()) {
        '.html' { return 'text/html; charset=utf-8' }
        '.css'  { return 'text/css' }
        '.js'   { return 'application/javascript' }
        '.json' { return 'application/json' }
        '.png'  { return 'image/png' }
        default { return 'application/octet-stream' }
    }
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $buf = New-Object byte[] 8192
            $n = $stream.Read($buf, 0, $buf.Length)
            $req = [System.Text.Encoding]::UTF8.GetString($buf, 0, $n)
            $firstLine = ($req -split "`r`n")[0]
            $parts = $firstLine -split ' '
            $path = if ($parts.Length -ge 2) { $parts[1] } else { '/' }
            if ($path -eq '/') { $path = '/index.html' }
            $qIdx = $path.IndexOf('?')
            if ($qIdx -ge 0) { $path = $path.Substring(0, $qIdx) }
            $filePath = Join-Path $root ($path.TrimStart('/').Replace('/', '\'))
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $mime = Get-MimeType ([System.IO.Path]::GetExtension($filePath))
            } else {
                $bytes = [System.IO.File]::ReadAllBytes((Join-Path $root 'index.html'))
                $mime = 'text/html; charset=utf-8'
            }
            $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nConnection: close`r`n`r`n"
            $hb = [System.Text.Encoding]::ASCII.GetBytes($header)
            $stream.Write($hb, 0, $hb.Length)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Flush()
        } catch {}
        $client.Close()
    }
} finally {
    $listener.Stop()
}
