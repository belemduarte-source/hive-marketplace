$file = "C:\Users\35191\Desktop\Claude\b2b-marketplace.html"
$lines = [System.IO.File]::ReadAllLines($file)
Write-Host "Lines before: $($lines.Count)"
# Remove lines 4364-4887 (0-indexed 4363-4886)
$keep = $lines[0..4362] + $lines[4886..($lines.Count - 1)]
Write-Host "Lines after: $($keep.Count)"
[System.IO.File]::WriteAllLines($file, $keep, [System.Text.Encoding]::UTF8)
Write-Host "Done"
