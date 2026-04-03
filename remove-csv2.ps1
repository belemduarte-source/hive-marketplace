$file = "C:\Users\35191\Desktop\Claude\b2b-marketplace.html"
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

# Remove everything from _CSV_CHUNK1_START_ marker through _CSV_CHUNK1_END_ marker
$pattern1 = [regex]::Escape("/* _CSV_CHUNK1_START_ */")
$pattern2 = [regex]::Escape("/* _CSV_CHUNK1_END_ */")

$start1 = $content.IndexOf("/* _CSV_CHUNK1_START_ */")
$end1 = $content.IndexOf("/* _CSV_CHUNK1_END_ */") + "/* _CSV_CHUNK1_END_ */".Length
if ($start1 -ge 0 -and $end1 -gt $start1) {
    $content = $content.Substring(0, $start1) + $content.Substring($end1)
    Write-Host "Removed chunk 1 ($($end1-$start1) chars)"
}

# Now find and remove from the PASSO 3 section through the closing */ marker
$csvStart = $content.IndexOf("/* ── PASSO 3: Importação em progresso ── */")
if ($csvStart -lt 0) { $csvStart = $content.IndexOf("* ── PASSO 3:") }
$csvEnd = $content.IndexOf("═════════════════════════ */") + "═════════════════════════ */".Length
if ($csvStart -ge 0 -and $csvEnd -gt $csvStart) {
    $content = $content.Substring(0, $csvStart) + $content.Substring($csvEnd)
    Write-Host "Removed PASSO3+ section"
}

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Saved."
