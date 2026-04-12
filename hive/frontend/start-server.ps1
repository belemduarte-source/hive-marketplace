$js = 'C:\Users\35191\Desktop\Claude\hive\frontend\serve.js'
$proc = (Get-WmiObject -List Win32_Process).Create("node.exe `"$js`"")
Write-Host "Server started. PID: $($proc.ProcessId)"
Start-Sleep 2
try {
    $r = Invoke-WebRequest -Uri 'http://localhost:9091' -UseBasicParsing -TimeoutSec 3
    Write-Host "Server is UP at http://localhost:9091"
    Start-Process 'http://localhost:9091'
} catch {
    Write-Host "Server check failed: $_"
}
