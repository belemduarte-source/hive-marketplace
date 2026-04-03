$file = "C:\Users\35191\Desktop\Claude\b2b-marketplace.html"
$content = Get-Content $file -Raw -Encoding UTF8
$wrench    = [System.Char]::ConvertFromUtf32(0x1F527)
$chart     = [System.Char]::ConvertFromUtf32(0x1F4CA)
$factory   = [System.Char]::ConvertFromUtf32(0x1F3ED)
$star      = [System.Char]::ConvertFromUtf32(0x2B50)
$dart      = [System.Char]::ConvertFromUtf32(0x1F3AF)
$label     = [System.Char]::ConvertFromUtf32(0x1F3F7) + [char]0xFE0F
$medal     = [System.Char]::ConvertFromUtf32(0x1F947)
$chk       = [char]0x2713
$newBox    = [System.Char]::ConvertFromUtf32(0x1F195)
$bookmark  = [System.Char]::ConvertFromUtf32(0x1F516)
$pin       = [System.Char]::ConvertFromUtf32(0x1F4CD)
$satellite = [System.Char]::ConvertFromUtf32(0x1F4E1)
$speech    = [System.Char]::ConvertFromUtf32(0x1F4AC)
$office    = [System.Char]::ConvertFromUtf32(0x1F3E2)
$emailE    = [System.Char]::ConvertFromUtf32(0x1F4E7)
$mag       = [System.Char]::ConvertFromUtf32(0x1F50D)
function Rep { param($t,$k,$e,$v,$n) return $t.Replace($k+":" + [char]39 + $e + " " + $v + [char]39, $k+":" + [char]39 + $n + [char]39) }

# PT
$content = $content.Replace("navRegister:" + [char]39 + "+ Registar Empresa" + [char]39, "navRegister:" + [char]39 + "Registar Empresa" + [char]39)
$content = Rep $content "filterTitle" $wrench "Filtros" "Filtros"
$content = Rep $content "sortBy" $chart "Ordenar Por" "Ordenar Por"
$content = Rep $content "sectorArea" $factory ([char]0xC1+"rea de Atividade") ([char]0xC1+"rea de Atividade")
$content = Rep $content "minRating" $star ("Avalia"+[char]0xE7+[char]0xE3+"o M"+[char]0xED+"nima") ("Avalia"+[char]0xE7+[char]0xE3+"o M"+[char]0xED+"nima")
$content = Rep $content "searchRadius" $dart "Raio de Pesquisa" "Raio de Pesquisa"
$content = Rep $content "featured" $label "Destaque" "Destaque"
$content = Rep $content "topRated" $medal "Top Rated" "Top Rated"
$content = Rep $content "verified" $chk "Verificado" "Verificado"
$content = Rep $content "newEntry" $newBox "Novo Registo" "Novo Registo"
$content = Rep $content "specialties" $bookmark "Especialidades" "Especialidades"
$content = Rep $content "detailLocation" $pin ("Localiza"+[char]0xE7+[char]0xE3+"o") ("Localiza"+[char]0xE7+[char]0xE3+"o")
$content = Rep $content "detailRating" $star ("Avalia"+[char]0xE7+[char]0xE3+"o Multidimensional") ("Avalia"+[char]0xE7+[char]0xE3+"o Multidimensional")
$content = Rep $content "detailContact" $satellite "Canais de Contacto" "Canais de Contacto"
$content = Rep $content "detailSpecialties" $label "Especialidades" "Especialidades"
$content = $content.Replace("detailReviews:"+[char]39+$speech+" Reviews Verificadas"+[char]39, "detailReviews:"+[char]39+"Avalia"+[char]0xE7+[char]0xF5+"es Verificadas"+[char]39)
$content = Rep $content "emptyBtn" $office "Registar Empresa" "Registar Empresa"
$content = Rep $content "regTitle" $office "Registar Nova Empresa" "Registar Nova Empresa"
$content = Rep $content "regSubmit" $office "Registar Empresa" "Registar Empresa"
$content = Rep $content "emailTitle" $emailE ("Pedido de Or"+[char]0xE7+"amento") ("Pedido de Or"+[char]0xE7+"amento")
$content = Rep $content "heroBtnSearch" $mag "Explorar Empresas" "Explorar Empresas"
$content = Rep $content "heroBtnRegister" $office "Registar a minha Empresa" "Registar a minha Empresa"

# EN
$content = $content.Replace("navRegister:"+[char]39+"+ Register Company"+[char]39, "navRegister:"+[char]39+"Register Company"+[char]39)
$content = Rep $content "filterTitle" $wrench "Filters" "Filters"
$content = Rep $content "sortBy" $chart "Sort By" "Sort By"
$content = Rep $content "sectorArea" $factory "Activity Area" "Activity Area"
$content = Rep $content "minRating" $star "Minimum Rating" "Minimum Rating"
$content = Rep $content "searchRadius" $dart "Search Radius" "Search Radius"
$content = Rep $content "featured" $label "Featured" "Featured"
$content = Rep $content "topRated" $medal "Top Rated" "Top Rated"
$content = Rep $content "verified" $chk "Verified" "Verified"
$content = Rep $content "newEntry" $newBox "New Entry" "New Entry"
$content = Rep $content "specialties" $bookmark "Specialties" "Specialties"
$content = Rep $content "detailLocation" $pin "Location" "Location"
$content = Rep $content "detailRating" $star "Multidimensional Rating" "Multidimensional Rating"
$content = Rep $content "detailContact" $satellite "Contact Channels" "Contact Channels"
$content = Rep $content "detailSpecialties" $label "Specialties" "Specialties"
$content = Rep $content "detailReviews" $speech "Verified Reviews" "Verified Reviews"
$content = Rep $content "emptyBtn" $office "Register Company" "Register Company"
$content = Rep $content "regTitle" $office "Register New Company" "Register New Company"
$content = Rep $content "regSubmit" $office "Register Company" "Register Company"
$content = Rep $content "emailTitle" $emailE "Quote Request" "Quote Request"
$content = Rep $content "heroBtnSearch" $mag "Explore Companies" "Explore Companies"
$content = Rep $content "heroBtnRegister" $office "Register my Company" "Register my Company"

# FR
$content = $content.Replace("navRegister:"+[char]39+"+ Enregistrer Entreprise"+[char]39, "navRegister:"+[char]39+"Enregistrer Entreprise"+[char]39)
$content = Rep $content "filterTitle" $wrench "Filtres" "Filtres"
$content = Rep $content "sortBy" $chart "Trier Par" "Trier Par"
$content = Rep $content "minRating" $star ([char]0xC9+"valuation Minimale") ([char]0xC9+"valuation Minimale")
$content = Rep $content "searchRadius" $dart "Rayon de Recherche" "Rayon de Recherche"
$content = Rep $content "featured" $label "En Vedette" "En Vedette"
$content = Rep $content "topRated" $medal ("Mieux Not"+[char]0xE9) ("Mieux Not"+[char]0xE9)
$content = Rep $content "verified" $chk ([char]0x56+[char]0xE9+"rifi"+[char]0xE9) ([char]0x56+[char]0xE9+"rifi"+[char]0xE9)
$content = Rep $content "newEntry" $newBox "Nouveau Enregistrement" "Nouveau Enregistrement"
$content = Rep $content "specialties" $bookmark ("Sp"+[char]0xE9+"cialit"+[char]0xE9+"s") ("Sp"+[char]0xE9+"cialit"+[char]0xE9+"s")
$content = Rep $content "detailLocation" $pin "Localisation" "Localisation"
$content = Rep $content "detailRating" $star ([char]0xC9+"valuation Multidimensionnelle") ([char]0xC9+"valuation Multidimensionnelle")
$content = Rep $content "detailContact" $satellite "Canaux de Contact" "Canaux de Contact"
$content = Rep $content "detailSpecialties" $label ("Sp"+[char]0xE9+"cialit"+[char]0xE9+"s") ("Sp"+[char]0xE9+"cialit"+[char]0xE9+"s")
$content = Rep $content "detailReviews" $speech ("Avis V"+[char]0xE9+"rifi"+[char]0xE9+"s") ("Avis V"+[char]0xE9+"rifi"+[char]0xE9+"s")
$content = Rep $content "emptyBtn" $office "Enregistrer Entreprise" "Enregistrer Entreprise"
$content = Rep $content "regSubmit" $office "Enregistrer Entreprise" "Enregistrer Entreprise"
$content = Rep $content "emailTitle" $emailE "Demande de Devis" "Demande de Devis"
$content = Rep $content "heroBtnSearch" $mag "Explorer les Entreprises" "Explorer les Entreprises"
$content = Rep $content "heroBtnRegister" $office "Enregistrer mon Entreprise" "Enregistrer mon Entreprise"
$content = Rep $content "regTitle" $office "Enregistrer une Nouvelle Entreprise" "Enregistrer une Nouvelle Entreprise"
$frSectorOld = "sectorArea:" + [char]34 + $factory + " Secteur d" + [char]39 + "Activit" + [char]0xE9 + [char]34
$frSectorNew = "sectorArea:" + [char]34 + "Secteur d" + [char]39 + "Activit" + [char]0xE9 + [char]34
$content = $content.Replace($frSectorOld, $frSectorNew)

# searchUpdated toasts
$content = $content.Replace("searchUpdated:"+[char]39+$mag+" Pesquisa atualizada\!"+[char]39, "searchUpdated:"+[char]39+"Pesquisa atualizada\!"+[char]39)
$content = $content.Replace("searchUpdated:"+[char]39+$mag+" Search updated\!"+[char]39, "searchUpdated:"+[char]39+"Search updated\!"+[char]39)
$content = $content.Replace("searchUpdated:"+[char]39+$mag+" Recherche mise "+[char]0xE0+" jour \!"+[char]39, "searchUpdated:"+[char]39+"Recherche mise "+[char]0xE0+" jour \!"+[char]39)

[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "Done. Checking for remaining emojis..."
$allEmoji = @($wrench,$chart,$factory,$star,$dart,$label,$medal,[string]$chk,$newBox,$bookmark,$pin,$satellite,$speech,$office,$emailE,$mag)
$hits = 0
foreach ($e in $allEmoji) { $m = [regex]::Matches($content,[regex]::Escape($e)); if($m.Count -gt 0){Write-Host ("  Still found ["+$e+"] "+$m.Count+" time(s)"); $hits+=$m.Count} }
if($hits -eq 0){Write-Host "SUCCESS: All targeted emojis removed."} else {Write-Host ("Remaining: "+$hits)}
