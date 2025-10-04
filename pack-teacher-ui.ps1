param(
  [string]$OutZip = ".\teacher-ui-clean.zip",
  [string]$FrontendRel = ".\frontend",
  [string]$PrototypeRel = ".\原型开发"
)

$ErrorActionPreference = "Stop"

function Info($m){ Write-Host "==> $m" -ForegroundColor Cyan }
function Ok($m){ Write-Host "✔ $m" -ForegroundColor Green }
function Warn($m){ Write-Host "⚠ $m" -ForegroundColor Yellow }

# Use script directory as project root
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ProjectRoot

Info "ProjectRoot = $ProjectRoot"

$FrontendPath = Resolve-Path $FrontendRel -ErrorAction SilentlyContinue
if (-not $FrontendPath) { throw "找不到前端目录：$FrontendRel（相对 $ProjectRoot）" }
$FrontendPath = $FrontendPath.Path
Info "FrontendPath = $FrontendPath"

$SrcPath = Join-Path $FrontendPath "src"
if (-not (Test-Path $SrcPath)) { throw "缺少目录：$SrcPath" }

# Build temp directory
$Tmp = Join-Path $env:TEMP ("teacher_ui_clean_" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $Tmp | Out-Null

# Copy src & public (if any)
Info "复制 src/ 到临时目录"
Copy-Item $SrcPath (Join-Path $Tmp "src") -Recurse -Force

$PublicPath = Join-Path $FrontendPath "public"
if (Test-Path $PublicPath) {
  Info "复制 public/ 到临时目录"
  Copy-Item $PublicPath (Join-Path $Tmp "public") -Recurse -Force
} else {
  Warn "未发现 public/，跳过"
}

# Copy config files if exist
$maybeFiles = @(
  "package.json","tsconfig.json",
  "vite.config.ts","vite.config.js",
  "tailwind.config.js","tailwind.config.cjs",
  "postcss.config.js","postcss.config.cjs",
  ".eslintrc",".eslintrc.cjs",".eslintrc.js",".eslintrc.json",
  ".prettierrc",".prettierrc.json",".prettierrc.js",".prettierrc.cjs","prettier.config.js","prettier.config.cjs"
) | ForEach-Object { Join-Path $FrontendPath $_ }

foreach($f in $maybeFiles){
  if (Test-Path $f) {
    Copy-Item $f (Join-Path $Tmp (Split-Path $f -Leaf)) -Force
  }
}

# Optional: copy prototype folder
$PrototypePath = Resolve-Path $PrototypeRel -ErrorAction SilentlyContinue
if ($PrototypePath) {
  Info "复制 原型开发/ 到临时目录"
  Copy-Item $PrototypePath.Path (Join-Path $Tmp "原型开发") -Recurse -Force
} else {
  Warn "未发现 原型开发/，跳过（可选）"
}

# Create a quick src tree file for analysis
Info "导出 src 目录树"
$treeTxt = Join-Path $Tmp "src_tree.txt"
try {
  Get-ChildItem (Join-Path $Tmp "src") -Recurse -Depth 4 | Select-Object FullName,Length |
    Out-File $treeTxt -Encoding UTF8
} catch {
  Get-ChildItem (Join-Path $Tmp "src") -Recurse | Select-Object FullName,Length |
    Out-File $treeTxt -Encoding UTF8
}

# Create zip
$OutZipPath = Resolve-Path "." | ForEach-Object { Join-Path $_.Path $OutZip }
if (Test-Path $OutZipPath) { Remove-Item $OutZipPath -Force }

Info "打包为 $OutZipPath"
Compress-Archive -Path (Join-Path $Tmp "*") -DestinationPath $OutZipPath -Force

Ok "已生成：$OutZipPath"
Ok "大小：$((Get-Item $OutZipPath).Length) 字节"

# Cleanup temp
Remove-Item $Tmp -Recurse -Force | Out-Null
