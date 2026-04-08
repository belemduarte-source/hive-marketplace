# Hive Backend Setup
# Run once after installing Node.js and PostgreSQL
# Usage: powershell -File setup.ps1

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

Write-Host ""
Write-Host "=== Hive Backend Setup ===" -ForegroundColor Cyan

# 1. Check Node.js
try {
    $nodeVer = node --version
    Write-Host "✅ Node.js $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Install from https://nodejs.org (LTS)" -ForegroundColor Red
    exit 1
}

# 2. Check PostgreSQL
try {
    $pgVer = psql --version
    Write-Host "✅ PostgreSQL found: $pgVer" -ForegroundColor Green
} catch {
    Write-Host "❌ PostgreSQL not found. Install from https://www.postgresql.org/download/windows/" -ForegroundColor Red
    exit 1
}

# 3. Create DB and user
Write-Host ""
Write-Host "Creating database and user..." -ForegroundColor Yellow
$sql = @"
DO `$`$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hive_user') THEN
    CREATE ROLE hive_user WITH LOGIN PASSWORD 'hive_pass';
  END IF;
END
`$`$;
CREATE DATABASE hive_db OWNER hive_user;
GRANT ALL PRIVILEGES ON DATABASE hive_db TO hive_user;
"@

# Try running as postgres superuser
try {
    $sql | psql -U postgres -c $sql 2>&1 | Out-Null
    Write-Host "✅ Database hive_db ready" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not auto-create DB. Run manually:" -ForegroundColor Yellow
    Write-Host "   psql -U postgres" -ForegroundColor White
    Write-Host "   CREATE ROLE hive_user WITH LOGIN PASSWORD 'hive_pass';" -ForegroundColor White
    Write-Host "   CREATE DATABASE hive_db OWNER hive_user;" -ForegroundColor White
}

# 4. Install npm dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Set-Location $root
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green

# 5. Run seed
Write-Host ""
Write-Host "Seeding database..." -ForegroundColor Yellow
node src/seed/seed.js
Write-Host "✅ Database seeded" -ForegroundColor Green

# 6. Start server
Write-Host ""
Write-Host "Starting backend on http://localhost:4000" -ForegroundColor Cyan
node src/index.js
