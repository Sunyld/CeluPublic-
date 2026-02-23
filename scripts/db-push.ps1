# db-push.ps1 - Link Supabase using .env and run db push
# Uses NEXT_PUBLIC_SUPABASE_URL or VITE_SUPABASE_URL from .env to get project ref.

$ErrorActionPreference = "Stop"
$projectRoot = Join-Path $PSScriptRoot ".."
$envFile = Join-Path $projectRoot ".env"

if (-not (Test-Path $envFile)) {
    Write-Error ".env not found at $envFile"
    exit 1
}

$content = Get-Content $envFile -Raw
$ref = $null

# Try NEXT_PUBLIC_SUPABASE_URL (Next.js)
if ($content -match 'NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?://([^.]+)\.supabase\.co') {
    $ref = $Matches[1]
}
# Try VITE_SUPABASE_URL
if (-not $ref -and $content -match 'VITE_SUPABASE_URL\s*=\s*https?://([^.]+)\.supabase\.co') {
    $ref = $Matches[1]
}
# Try SUPABASE_URL
if (-not $ref -and $content -match 'SUPABASE_URL\s*=\s*https?://([^.]+)\.supabase\.co') {
    $ref = $Matches[1]
}

if (-not $ref) {
    Write-Error "Could not find project ref in .env. Add NEXT_PUBLIC_SUPABASE_URL=https://YOUR_REF.supabase.co"
    exit 1
}

Write-Host "Project ref: $ref"
Write-Host "Linking project..."
& npx supabase link --project-ref $ref
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "If link asked for database password: use the password from Supabase Dashboard -> Project Settings -> Database."
    Write-Host "Or set SUPABASE_ACCESS_TOKEN (from https://supabase.com/dashboard/account/tokens) in .env and run again."
    exit $LASTEXITCODE
}

Write-Host "Pushing migrations..."
& npx supabase db push
exit $LASTEXITCODE
