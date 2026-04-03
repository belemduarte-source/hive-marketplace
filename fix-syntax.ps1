$file = "C:\Users\35191\Desktop\Claude\b2b-marketplace.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$startMarker = "/* CSV dead code below - removed button/modal, functions never called */"
$endMarker = "window.diagnosticCheck"

$startIdx = $content.IndexOf($startMarker)
$endIdx = $content.IndexOf($endMarker)

if ($startIdx -ge 0 -and $endIdx -gt $startIdx) {
    $before = $content.Substring(0, $startIdx)
    $after = $content.Substring($endIdx)
    $newContent = $before + $after
    [System.IO.File]::WriteAllText($file, $newContent, [System.Text.Encoding]::UTF8)
    Write-Host "SUCCESS: Removed $($endIdx - $startIdx) chars of dead CSV code"
    Write-Host "File saved."
} else {
    Write-Host "ERROR: Could not find markers"
    Write-Host "startIdx=$startIdx, endIdx=$endIdx"
}
