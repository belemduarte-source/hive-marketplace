$c=Get-Content "C:\Users\35191\Desktop\Claude\b2b-marketplace.html" -Raw -Encoding UTF8
$emojis = [ordered]@{
  "chart"=[System.Char]::ConvertFromUtf32(0x1F4CA)
  "factory"=[System.Char]::ConvertFromUtf32(0x1F3ED)
  "dart"=[System.Char]::ConvertFromUtf32(0x1F3AF)
  "label"=[System.Char]::ConvertFromUtf32(0x1F3F7)
  "medal"=[System.Char]::ConvertFromUtf32(0x1F947)
  "newBox"=[System.Char]::ConvertFromUtf32(0x1F195)
  "bookmark"=[System.Char]::ConvertFromUtf32(0x1F516)
  "pin"=[System.Char]::ConvertFromUtf32(0x1F4CD)
  "satellite"=[System.Char]::ConvertFromUtf32(0x1F4E1)
  "speech"=[System.Char]::ConvertFromUtf32(0x1F4AC)
  "emailE"=[System.Char]::ConvertFromUtf32(0x1F4E7)
  "mag"=[System.Char]::ConvertFromUtf32(0x1F50D)
}
foreach ($name in $emojis.Keys) {
  $e = $emojis[$name]
  $idx = 0; $n=0
  while(($idx = $c.IndexOf($e, $idx)) -ge 0) {
    $start = [Math]::Max(0,$idx-60)
    $safe = [System.Text.RegularExpressions.Regex]::Replace($c.Substring($start,130),"[^\x00-\x7F]","?")
    Write-Host ("="+$name+" at "+$idx+": "+$safe)
    $idx++; $n++
  }
  if($n -gt 0){Write-Host ("  --> "+$n+" total")}
}
