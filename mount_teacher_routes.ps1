param(
  [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"
function Step($m){ Write-Host "==> $m" -ForegroundColor Cyan }
function Info($m){ Write-Host " • $m" -ForegroundColor DarkGray }

# Paths
$root = (Resolve-Path $ProjectRoot).Path
$frontend = Join-Path $root "frontend"
$src = Join-Path $frontend "src"

if (!(Test-Path $src)) { throw "Cannot find src/ under $frontend. Set -ProjectRoot to project root that contains frontend/." }

Step "Scanning router entry files..."
# Candidate files to patch
$candidates = @()
$candidates += Get-ChildItem -Path $src -Include "index.tsx","index.ts","App.tsx","App.ts","router.tsx","router/index.tsx","routes.tsx","routes/index.tsx","main.tsx","main.ts" -Recurse -ErrorAction SilentlyContinue

# If no candidates found, take all .tsx/.ts under src/ up to 100 files
if ($candidates.Count -eq 0) {
  $candidates = Get-ChildItem -Path $src -Include *.tsx,*.ts -Recurse | Select-Object -First 100
}

$patched = $false
foreach($f in $candidates){
  $code = Get-Content $f.FullName -Raw

  if ($code -match "TeacherLayout" -and $code -match "router/teacher") {
    Info "Already mounted in $($f.FullName)"
    $patched = $true
    break
  }

  # Case A: createBrowserRouter([...])
  if ($code -match "createBrowserRouter\s*\(\s*\["){
    Info "Detected createBrowserRouter in $($f.FullName)"
    $bak = "$($f.FullName).bak"
    Copy-Item $f.FullName $bak -Force

    # Ensure imports
    if ($code -notmatch "from\s+['""]@/layouts/TeacherLayout['""]") {
      $code = "import TeacherLayout from '@/layouts/TeacherLayout';`r`n" + $code
    }
    if ($code -notmatch "from\s+['""]@/router/teacher['""]") {
      $code = "import TeacherRoutes from '@/router/teacher';`r`n" + $code
    }

    # Insert route object before closing "]);"
    $routeBlock = "{ path: '/teacher', element: <TeacherLayout />, children: TeacherRoutes }"
    if ($code -notmatch [regex]::Escape($routeBlock)) {
      $code = [regex]::Replace(
        $code,
        "createBrowserRouter\s*\(\s*\[\s*",
        "createBrowserRouter([\r\n  [  " + $routeBlock + ", "
      )
    }

    Set-Content -Path $f.FullName -Value $code -Encoding UTF8
    Step "Patched $($f.Name) (createBrowserRouter). Backup: $bak"
    $patched = $true
    break
  }

  # Case B: <Routes> ... </Routes>
  if ($code -match "<Routes>"){
    Info "Detected <Routes> in $($f.FullName)"
    $bak = "$($f.FullName).bak"
    Copy-Item $f.FullName $bak -Force

    # Ensure imports
    if ($code -notmatch "from\s+['""]@/layouts/TeacherLayout['""]") {
      $code = "import TeacherLayout from '@/layouts/TeacherLayout';`r`n" + $code
    }
    if ($code -notmatch "from\s+['""]@/router/teacher['""]") {
      $code = "import TeacherRoutes from '@/router/teacher';`r`n" + $code
    }

    $block = "<Route path=""/teacher"" element={<TeacherLayout />}>{TeacherRoutes.map(r => <Route key={r.path || 'index'} index={r.index} path={r.path} element={r.element} />)}</Route>"
    if ($code -notmatch [regex]::Escape($block)) {
      $code = $code -replace "</Routes>", "  " + $block + "`r`n</Routes>"
    }

    Set-Content -Path $f.FullName -Value $code -Encoding UTF8
    Step "Patched $($f.Name) (<Routes>). Backup: $bak"
    $patched = $true
    break
  }
}

if (-not $patched) {
  Write-Host "!! Could not locate a router entry to patch automatically." -ForegroundColor Yellow
  Write-Host "   If your main router file is uncommon, tell me its path and I'll tailor the patch." -ForegroundColor Yellow
} else {
  Step "Done. Now run:"
  Write-Host "cd `"$frontend`" && npm run dev" -ForegroundColor Green
}