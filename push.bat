@echo off
cd /d "%~dp0"

:: Supprimer le lock git si present (crash precedent)
if exist ".git\index.lock" (
    del /f ".git\index.lock"
    echo Lock git supprime.
)

git add -A
git diff --cached --quiet
if %errorlevel% == 0 (
    echo Aucun changement a pusher.
) else (
    git commit -m "update: %date% %time%"
    git push
    echo Push effectue !
)
pause
