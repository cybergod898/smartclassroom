$Root = "D:\smartclassroom\teacher-fullstack-v0_9_0"
$Dest = Join-Path $Root "teacher-ui-clean.zip"
$tmp  = Join-Path $env:TEMP ("ui_clean_" + (Get-Random))

$ErrorActionPreference = 'SilentlyContinue'

New-Item -ItemType Directory -Path $tmp -Force | Out-Null

# 必要目录/文件
Copy-Item "$Root\frontend\src"     "$tmp\src"     -Recurse
Copy-Item "$Root\frontend\public"  "$tmp\public"  -Recurse
Copy-Item "$Root\frontend\package.json" "$tmp\package.json"
Copy-Item "$Root\frontend\tsconfig.json" "$tmp\tsconfig.json"

# 常见构建/样式配置（有就复制）
Copy-Item "$Root\frontend\vite.config.*"      "$tmp"
Copy-Item "$Root\frontend\tailwind.config.*"  "$tmp"
Copy-Item "$Root\frontend\postcss.config.*"   "$tmp"
Copy-Item "$Root\frontend\*.eslintrc*"        "$tmp"
Copy-Item "$Root\frontend\*.prettier*"        "$tmp"

# 原型（可选但推荐）
Copy-Item "$Root\原型开发" "$tmp\原型开发" -Recurse

Remove-Item $Dest -Force
Compress-Archive -Path (Join-Path $tmp "*") -DestinationPath $Dest -Force
Write-Host "打包完成: $Dest"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue