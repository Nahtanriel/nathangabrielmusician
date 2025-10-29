@echo off
echo ===============================================
echo   LibreOffice → Markdown Converter (Pandoc)
echo ===============================================

REM Change directory to where this .bat file is located
cd /d "%~dp0"

REM Loop through all .odt files in the current folder
for %%f in (*.odt) do (
    echo Converting: %%f
    pandoc "%%f" -t gfm --wrap=none -o "%%~nf.md"
)

echo -----------------------------------------------
echo ✅ Conversion complete! All .odt files → .md
echo -----------------------------------------------
pause
