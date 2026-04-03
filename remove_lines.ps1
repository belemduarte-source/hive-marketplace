$file = "C:\Users\35191\Desktop\Claude\b2b-marketplace.html"
$lines = Get-Content $file -Encoding UTF8
$newLines = $lines[0..2045] + $lines[2550..($lines.Count-1)]
$newLines | Set-Content $file -Encoding UTF8
Write-Host ("Removed old lines. New total: " + $newLines.Count)
