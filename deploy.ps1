# Script de deploy para Windows
Write-Host "🚀 Iniciando deploy do Agendaladohostil..." -ForegroundColor Green

# Criar diretórios necessários
if (-not (Test-Path "nginx/conf.d")) {
    New-Item -ItemType Directory -Path "nginx/conf.d" -Force
}
if (-not (Test-Path "nginx/logs")) {
    New-Item -ItemType Directory -Path "nginx/logs" -Force
}

# Build e deploy
Write-Host "📦 Construindo e deployando stack..." -ForegroundColor Yellow
docker stack deploy -c docker-compose.yml agendaladohostil

# Aguardar serviços iniciarem
Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar status
Write-Host "📊 Status dos serviços:" -ForegroundColor Green
docker service ls

Write-Host "✅ Deploy concluído! Acesse http://localhost" -ForegroundColor Green
Write-Host "📝 Logs disponíveis em:"
Write-Host "   - Nginx: nginx/logs/"
Write-Host "   - Next.js: docker service logs agendaladohostil_nextjs"

docker stack rm agendaladohostil
docker network rm agendaladohostil_app_network
docker network create --driver overlay agendaladohostil_app_network 