@echo off
REM pack-teacher-ui.cmd - 调用 PowerShell 打包教师端前端为 teacher-ui-clean.zip
setlocal
set SCRIPT_DIR=%~dp0
powershell -ExecutionPolicy Bypass -File "%SCRIPT_DIR%pack-teacher-ui.ps1" -OutZip ".\teacher-ui-clean.zip"
if %ERRORLEVEL% NEQ 0 (
  echo 打包失败（见上方错误）。
  exit /b %ERRORLEVEL%
)
echo.
echo ===============================
echo 已生成 teacher-ui-clean.zip
echo ===============================
endlocal
