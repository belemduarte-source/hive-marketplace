# ============================================================
# fetch-empresas.ps1
# Descarrega empresas portuguesas do OpenStreetMap (Overpass)
# e gera CSV pronto a importar no Linx
# ============================================================

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$OutputFile = "$PSScriptRoot\empresas-portugal.csv"
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  LINX - Download de Empresas (OSM/Overpass)" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Mapeamento OSM tag -> CAE e sector
$TagToCAE = @{
    "electrician"        = @{ cae = "43211"; sector = "Eletricistas" }
    "plumber"            = @{ cae = "43221"; sector = "Picheleiros" }
    "painter"            = @{ cae = "43341"; sector = "Pintores" }
    "carpenter"          = @{ cae = "43321"; sector = "Carpinteiros" }
    "roofer"             = @{ cae = "43910"; sector = "Telhados e Coberturas" }
    "glazier"            = @{ cae = "43342"; sector = "Vidraceiros" }
    "stonemason"         = @{ cae = "43994"; sector = "Pedreiros" }
    "plasterer"          = @{ cae = "43310"; sector = "Estucadores" }
    "tiler"              = @{ cae = "43331"; sector = "Azulejos e Ceramica" }
    "bricklayer"         = @{ cae = "43994"; sector = "Alvenaria" }
    "metalworker"        = @{ cae = "43995"; sector = "Serralharia" }
    "locksmith"          = @{ cae = "43995"; sector = "Serralharia" }
    "hvac"               = @{ cae = "43222"; sector = "Climatizacao AVAC" }
    "insulation"         = @{ cae = "43291"; sector = "Isolamento" }
    "architect"          = @{ cae = "71110"; sector = "Arquitetura e Projetos" }
    "engineer"           = @{ cae = "71120"; sector = "Engenharia Civil" }
    "surveyor"           = @{ cae = "71122"; sector = "Topografia" }
    "landscape_architect"= @{ cae = "81300"; sector = "Paisagismo e Jardins" }
    "hardware"           = @{ cae = "47521"; sector = "Materiais de Construcao" }
    "doityourself"       = @{ cae = "47521"; sector = "Materiais de Construcao" }
    "flooring"           = @{ cae = "43332"; sector = "Pavimentos e Revestimentos" }
    "gardener"           = @{ cae = "81300"; sector = "Paisagismo e Jardins" }
}

# Queries Overpass por grupo (evita timeout)
$Queries = @(
    @{
        label = "Artesaos de construcao (craft)"
        query = '[out:json][timeout:60];area["ISO3166-1"="PT"][admin_level=2]->.pt;(node["craft"~"electrician|plumber|painter|carpenter|roofer|glazier|stonemason|plasterer|tiler|bricklayer|metalworker|locksmith|hvac|insulation|flooring|gardener"](area.pt);way["craft"~"electrician|plumber|painter|carpenter|roofer|glazier|stonemason|plasterer|tiler|bricklayer|metalworker|locksmith"](area.pt););out center body;'
    },
    @{
        label = "Escritorios tecnico-profissionais (office)"
        query = '[out:json][timeout:60];area["ISO3166-1"="PT"][admin_level=2]->.pt;(node["office"~"architect|engineer|surveyor|landscape_architect"](area.pt);way["office"~"architect|engineer|surveyor"](area.pt););out center body;'
    },
    @{
        label = "Lojas de materiais de construcao (shop)"
        query = '[out:json][timeout:60];area["ISO3166-1"="PT"][admin_level=2]->.pt;(node["shop"~"hardware|doityourself|flooring|paint"](area.pt);way["shop"~"hardware|doityourself|flooring"](area.pt););out center body;'
    },
    @{
        label = "Empresas de construcao (building/industrial)"
        query = '[out:json][timeout:60];area["ISO3166-1"="PT"][admin_level=2]->.pt;(node["landuse"="industrial"]["name"](area.pt);node["building"="industrial"]["name"](area.pt););out center body;'
    }
)

$AllResults = [System.Collections.ArrayList]::new()
$Seen = [System.Collections.Generic.HashSet[string]]::new()

foreach ($q in $Queries) {
    Write-Host "  A consultar: $($q.label)..." -ForegroundColor Yellow
    try {
        $encoded = [System.Uri]::EscapeDataString($q.query)
        $body = "data=$encoded"
        $resp = Invoke-WebRequest `
            -Uri "https://overpass-api.de/api/interpreter" `
            -Method POST `
            -Body $body `
            -ContentType "application/x-www-form-urlencoded" `
            -TimeoutSec 90 `
            -UseBasicParsing
        $json = $resp.Content | ConvertFrom-Json
        $count = $json.elements.Count
        Write-Host "    -> $count elementos recebidos" -ForegroundColor Green

        foreach ($el in $json.elements) {
            $id = "osm_$($el.id)"
            if ($Seen.Contains($id)) { continue }
            $null = $Seen.Add($id)

            # Coordenadas (node vs way)
            if ($el.type -eq "node") {
                $lat = $el.lat; $lon = $el.lon
            } elseif ($el.center) {
                $lat = $el.center.lat; $lon = $el.center.lon
            } else { continue }

            $tags = $el.tags
            if (-not $tags) { continue }

            $name = if ($tags.name) { $tags.name } else { "" }
            if ($name -eq "") { continue }  # ignora sem nome

            # Determina tipo e CAE
            $type = ""
            $cae  = ""
            $sector = ""
            if ($tags.craft -and $TagToCAE.ContainsKey($tags.craft)) {
                $type = $tags.craft
                $cae  = $TagToCAE[$tags.craft].cae
                $sector = $TagToCAE[$tags.craft].sector
            } elseif ($tags.office -and $TagToCAE.ContainsKey($tags.office)) {
                $type = $tags.office
                $cae  = $TagToCAE[$tags.office].cae
                $sector = $TagToCAE[$tags.office].sector
            } elseif ($tags.shop -and $TagToCAE.ContainsKey($tags.shop)) {
                $type = $tags.shop
                $cae  = $TagToCAE[$tags.shop].cae
                $sector = $TagToCAE[$tags.shop].sector
            } else {
                $cae = "41200"; $sector = "Construcao Geral"
            }

            # Endereço
            $morada   = if ($tags."addr:street") { $tags."addr:street" } else { "" }
            $cp       = if ($tags."addr:postcode") { $tags."addr:postcode" } else { "" }
            $localidade = if ($tags."addr:city") { $tags."addr:city" } `
                          elseif ($tags."addr:town") { $tags."addr:town" } `
                          elseif ($tags."addr:village") { $tags."addr:village" } else { "" }
            $distrito = if ($tags."addr:county") { $tags."addr:county" } else { "" }
            $phone    = if ($tags.phone) { $tags.phone } `
                        elseif ($tags."contact:phone") { $tags."contact:phone" } else { "" }
            $website  = if ($tags.website) { $tags.website } `
                        elseif ($tags."contact:website") { $tags."contact:website" } else { "" }
            $email    = if ($tags.email) { $tags.email } `
                        elseif ($tags."contact:email") { $tags."contact:email" } else { "" }

            $row = [PSCustomObject]@{
                Nome        = $name -replace '"', ''
                CAE         = $cae
                Sector      = $sector
                Morada      = $morada
                "Codigo Postal" = $cp
                Localidade  = $localidade
                Distrito    = $distrito
                Telefone    = $phone
                Website     = $website
                Email       = $email
                Latitude    = $lat
                Longitude   = $lon
                Fonte       = "OpenStreetMap"
            }
            $null = $AllResults.Add($row)
        }
        Start-Sleep -Milliseconds 2000  # pausa educada entre queries
    } catch {
        Write-Host "    ERRO: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Total de empresas recolhidas: $($AllResults.Count)" -ForegroundColor Cyan

if ($AllResults.Count -gt 0) {
    # Exporta CSV com separador ; (compativel com Excel PT)
    $csv = "Nome;CAE;Sector;Morada;Codigo Postal;Localidade;Distrito;Telefone;Website;Email;Latitude;Longitude;Fonte`n"
    foreach ($row in $AllResults) {
        $csv += "`"$($row.Nome)`";$($row.CAE);$($row.Sector);`"$($row.Morada)`";$($row."Codigo Postal");$($row.Localidade);$($row.Distrito);$($row.Telefone);$($row.Website);$($row.Email);$($row.Latitude);$($row.Longitude);$($row.Fonte)`n"
    }
    [System.IO.File]::WriteAllText($OutputFile, $csv, [System.Text.Encoding]::UTF8)
    Write-Host "Ficheiro guardado: $OutputFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "Distribuicao por sector:" -ForegroundColor Cyan
    $AllResults | Group-Object Sector | Sort-Object Count -Descending | ForEach-Object {
        Write-Host "  $($_.Name): $($_.Count)" -ForegroundColor White
    }
} else {
    Write-Host "Nenhum resultado. Verifica a ligacao a internet." -ForegroundColor Red
}

Write-Host ""
Write-Host "Concluido! Importa o ficheiro no Linx com o botao 'Importar CSV'" -ForegroundColor Green
Write-Host ""
