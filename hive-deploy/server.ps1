$port = if ($env:PORT) { $env:PORT } else { 3000 }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Hive server running on http://localhost:$port"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $resp = $ctx.Response
    $reqPath = $ctx.Request.Url.LocalPath
    $filePath = 'C:\Users\35191\Desktop\Claude\hive-deploy\index.html'
    try {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $resp.ContentType = 'text/html; charset=utf-8'
        $resp.StatusCode = 200
        $resp.ContentLength64 = $bytes.Length
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
        $resp.StatusCode = 500
    }
    $resp.Close()
}
