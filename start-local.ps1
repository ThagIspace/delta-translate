param(
    [ValidateRange(1024, 65535)]
    [int]$Port = 8765
)

$ErrorActionPreference = 'Stop'
$pythonCommand = Get-Command python -ErrorAction Stop

Write-Host "Delta Tools: http://127.0.0.1:$Port"
Write-Host 'Press Ctrl+C to stop. Keep the same address and port to reuse browser data.'
& $pythonCommand.Source -m http.server $Port --bind 127.0.0.1 --directory $PSScriptRoot
exit $LASTEXITCODE
