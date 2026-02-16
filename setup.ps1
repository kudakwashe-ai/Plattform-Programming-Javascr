# Quick Setup Script for Movie App
# Run this script to set up the database and start the server

Write-Host "🎬 Movie App - Quick Setup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env created. Please edit it with your database credentials and TMDB API key." -ForegroundColor Green
    Write-Host ""
    Write-Host "Press any key to continue after editing .env..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependencies installed." -ForegroundColor Green
    Write-Host ""
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate

Write-Host ""
Write-Host "🗄️  Database Setup" -ForegroundColor Cyan
Write-Host "Would you like to run database migrations now? (y/n)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "y" -or $response -eq "Y") {
    Write-Host "Running migrations..." -ForegroundColor Yellow
    npm run prisma:migrate
    
    Write-Host ""
    Write-Host "Would you like to seed the database with test users? (y/n)" -ForegroundColor Yellow
    $seedResponse = Read-Host
    
    if ($seedResponse -eq "y" -or $seedResponse -eq "Y") {
        Write-Host "Seeding database..." -ForegroundColor Yellow
        npm run prisma:seed
        Write-Host ""
        Write-Host " Database seeded with test users:" -ForegroundColor Green
        Write-Host "   Admin:   admin@movieapp.com / Admin@123" -ForegroundColor White
        Write-Host "   Premium: premium@movieapp.com / Premium@123" -ForegroundColor White
        Write-Host "   Free:    free@movieapp.com / Free@123" -ForegroundColor White
    }
}

Write-Host ""
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the server, run:" -ForegroundColor Cyan
Write-Host "  npm run dev      (Development mode with auto-reload)" -ForegroundColor White
Write-Host "  npm start        (Production mode)" -ForegroundColor White
Write-Host ""
Write-Host "Server will run at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host " Documentation:" -ForegroundColor Cyan
Write-Host "  API Documentation: API_DOCUMENTATION.md" -ForegroundColor White
Write-Host "  Database Setup:    DATABASE_SETUP.md" -ForegroundColor White
Write-Host "  README:            README.md" -ForegroundColor White
Write-Host ""
Write-Host " To run tests:" -ForegroundColor Cyan
Write-Host "  npm test                    (All tests)" -ForegroundColor White
Write-Host "  npm run test:coverage       (With coverage report)" -ForegroundColor White
Write-Host ""
