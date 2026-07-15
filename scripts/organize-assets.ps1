# Asset organization script - copies only, no modification
$ErrorActionPreference = "Continue"
$src = "E:\Assets"
$root = "E:\Projects\Birthday\public\assets"

$dirs = @(
    "$root\backgrounds",
    "$root\envelope",
    "$root\branding",
    "$root\decorations",
    "$root\scrapbook",
    "$root\letter",
    "$root\icons",
    "$root\final",
    "$root\fonts",
    "$root\music",
    "$root\memories\photos",
    "$root\memories\videos",
    "$root\memories\selected",
    "$root\raw\photos",
    "$root\raw\videos",
    "$root\raw\other"
)

foreach ($d in $dirs) {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
}

$designCopies = @{
    "$src\bg-cream-paper.png" = "$root\backgrounds\bg-cream-paper.png"
    "$src\bg-soft-pink-gradient.png" = "$root\backgrounds\bg-soft-pink-gradient.png"
    "$src\bg-film-grain.png" = "$root\backgrounds\bg-film-grain.png"
    "$src\flap-top.png" = "$root\envelope\envelope-flap-top.png"
    "$src\flap-left.png" = "$root\envelope\envelope-flap-left.png"
    "$src\flap-right.png" = "$root\envelope\envelope-flap-right.png"
    "$src\flap-bottom.png" = "$root\envelope\envelope-flap-bottom.png"
    "$src\envelope-letter-card.png" = "$root\envelope\envelope-letter-card.png"
    "$src\heart-seal-red.png" = "$root\envelope\heart-seal-red.png"
    "$src\heart-seal-gold.png" = "$root\envelope\heart-seal-gold.png"
    "$src\sajida-nazwa-logo.png" = "$root\branding\sajida-nazwa-logo.png"
    "$src\sn-monogram.png" = "$root\branding\sn-monogram.png"
    "$src\number-25-gold.png" = "$root\branding\number-25-gold.png"
    "$src\divider-gold-flourish.png" = "$root\decorations\divider-gold-flourish.png"
    "$src\corner-floral-left.png" = "$root\decorations\corner-floral-left.png"
    "$src\sparkle-gold.png" = "$root\decorations\sparkle-gold.png"
    "$src\floating-petal.png" = "$root\decorations\floating-petal.png"
    "$src\floating-heart.png" = "$root\decorations\floating-heart.png"
    "$src\heart-pin.png" = "$root\decorations\heart-pin.png"
    "$src\timeline-line-gold.png" = "$root\decorations\timeline-line-gold.png"
    "$src\timeline-dot-heart.png" = "$root\decorations\timeline-dot-heart.png"
    "$src\polaroid-frame.png" = "$root\scrapbook\polaroid-frame.png"
    "$src\photo-tape-pink.png" = "$root\scrapbook\photo-tape-pink.png"
    "$src\photo-tape-cream.png" = "$root\scrapbook\photo-tape-cream.png"
    "$src\paper-clip-gold.png" = "$root\scrapbook\paper-clip-gold.png"
    "$src\letter-paper-main.png" = "$root\letter\letter-paper-main.png"
    "$src\letter-fold-shadow.png" = "$root\letter\letter-fold-shadow.png"
    "$src\signature-SEEMON.png" = "$root\letter\signature-seemon.png"
    "$src\music-button.png" = "$root\icons\music-button.png"
    "$src\play-heart-button.png" = "$root\icons\play-heart-button.png"
    "$src\gallery-next.png" = "$root\icons\gallery-next.png"
    "$src\birthday-cake-25.mp4" = "$root\final\birthday-cake-25.mp4"
    "$src\final-heart-frame.png" = "$root\final\final-heart-frame.png"
    "$src\1.mp3" = "$root\music\special-song.mp3"
}

$illustrationCorrect = "$src\final-birthday-illustration.png"
$illustrationTypo = "$src\final-birthday-illustratio.png"
$illustrationDest = "$root\final\final-birthday-illustration.png"
if (Test-Path $illustrationCorrect) {
    $designCopies[$illustrationCorrect] = $illustrationDest
} elseif (Test-Path $illustrationTypo) {
    $designCopies[$illustrationTypo] = $illustrationDest
}

$musicM4a = "$src\2(1).m4a"
if (-not (Test-Path $musicM4a)) { $musicM4a = "$src\2.m4a" }
if (Test-Path $musicM4a) {
    $designCopies[$musicM4a] = "$root\music\happy-birthday-song.m4a"
}

$fontCopies = @{
    "$src\jumping-chick\Jumping Chick.otf" = "$root\fonts\Jumping Chick.otf"
    "$src\jumping-chick\Jumping Chick.ttf" = "$root\fonts\Jumping Chick.ttf"
    "$src\havana-personal-use-only\Havana.ttf" = "$root\fonts\Havana.ttf"
    "$src\happy-birthday-demo\HappyBirthday_Demo.ttf" = "$root\fonts\HappyBirthday_Demo.ttf"
}

$results = @{
    copied = @()
    missing = @()
    photos = 0
    videos = 0
}

function Copy-Asset($from, $to) {
    if (Test-Path $from) {
        Copy-Item -Path $from -Destination $to -Force
        $results.copied += $to
        return $true
    }
    $results.missing += $from
    return $false
}

foreach ($kv in $designCopies.GetEnumerator()) {
    Copy-Asset $kv.Key $kv.Value | Out-Null
}

foreach ($kv in $fontCopies.GetEnumerator()) {
    Copy-Asset $kv.Key $kv.Value | Out-Null
}

$excludeDirs = @(
    "jumping-chick",
    "havana-personal-use-only",
    "happy-birthday-demo"
)

$designNamePatterns = @(
    '^bg-', '^flap-', '^envelope', '^heart-seal', '^sajida', '^sn-monogram',
    '^number-25', '^divider', '^corner-floral', '^sparkle', '^floating-',
    '^heart-pin', '^timeline-', '^polaroid', '^photo-tape', '^paper-clip',
    '^letter-', '^signature', '^music-button', '^play-heart', '^gallery-',
    '^final-', '^birthday-cake', '^date-card'
)

$photoExts = @('.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp')
$videoExts = @('.mp4', '.mov', '.m4v')

function Is-DesignAsset($fileName) {
    $lower = $fileName.ToLower()
    foreach ($pat in $designNamePatterns) {
        if ($lower -match $pat) { return $true }
    }
    return $false
}

function Copy-MemoryFile($filePath) {
    $fileName = [System.IO.Path]::GetFileName($filePath)
    if (Is-DesignAsset $fileName) { return }

    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $destDir = $null
    $type = $null

    if ($photoExts -contains $ext) {
        $destDir = "$root\memories\photos"
        $type = "photo"
    } elseif ($videoExts -contains $ext) {
        $destDir = "$root\memories\videos"
        $type = "video"
    } else {
        return
    }

    $dest = Join-Path $destDir $fileName
    if (Test-Path $dest) {
        $base = [System.IO.Path]::GetFileNameWithoutExtension($fileName)
        $copyNum = 1
        do {
            $newName = "${base}-copy-${copyNum}${ext}"
            $dest = Join-Path $destDir $newName
            $copyNum++
        } while (Test-Path $dest)
    }

    Copy-Item -Path $filePath -Destination $dest -Force
    if ($type -eq "photo") { $results.photos++ } else { $results.videos++ }
    $results.copied += $dest
}

Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($src.Length).TrimStart('\')
    $topDir = ($rel -split '\\')[0]

    if ($excludeDirs -contains $topDir) { return }
    if ($topDir -eq "Photos-3-001" -or $topDir -like "Photos*") {
        Copy-MemoryFile $_.FullName
        return
    }

    # Root-level personal media only (not design assets at E:\Assets root)
    if ($rel -notmatch '\\') {
        Copy-MemoryFile $_.FullName
    }
}

$results | ConvertTo-Json -Depth 5 | Set-Content "E:\Projects\Birthday\scripts\organize-results.json" -Encoding UTF8
Write-Output "Design+font+music copied: $($results.copied.Count)"
Write-Output "Missing: $($results.missing.Count)"
Write-Output "Photos: $($results.photos)"
Write-Output "Videos: $($results.videos)"
