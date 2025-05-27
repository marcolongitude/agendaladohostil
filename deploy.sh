#!/bin/bash

# Função para verificar se o comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para mostrar mensagem de erro e sair
error_exit() {
    echo "❌ ERRO: $1" >&2
    exit 1
}

echo "🚀 Iniciando deploy do Agendaladohostil..."

# Verificar se o Docker está instalado
if ! command_exists docker; then
    error_exit "Docker não está instalado. Por favor, instale o Docker primeiro:
    https://docs.docker.com/engine/install/"
fi

# Verificar se o Docker está rodando
if ! docker info >/dev/null 2>&1; then
    error_exit "Docker não está rodando. Por favor, inicie o serviço do Docker."
fi

# Verificar se já está no modo Swarm
if ! docker node ls >/dev/null 2>&1; then
    echo "🔄 Inicializando Docker Swarm..."
    if ! docker swarm init; then
        error_exit "Falha ao inicializar o Docker Swarm. Verifique se:
        1. Você tem permissões suficientes
        2. O Docker está rodando corretamente
        3. Não há conflitos de rede
        
        Para mais informações, consulte:
        https://docs.docker.com/engine/swarm/swarm-tutorial/create-swarm/"
    fi
    echo "✅ Docker Swarm inicializado com sucesso!"
else
    echo "✅ Docker Swarm já está inicializado"
fi

# Criar diretórios necessários
mkdir -p nginx/conf.d
mkdir -p nginx/logs

# Remover stack e rede antigos, se existirem
echo "🧹 Limpando recursos antigos..."
docker stack rm agendaladohostil 2>/dev/null || true
sleep 10
docker network rm agendaladohostil_app_network 2>/dev/null || true

# Build da imagem Next.js
echo "🏗️  Construindo imagem Next.js..."
if ! docker build -t agendaladohostil:latest .; then
    error_exit "Falha ao construir a imagem Docker. Verifique os logs acima para mais detalhes."
fi

# Criar rede overlay
echo "🌐 Criando rede overlay..."
if ! docker network create --driver overlay agendaladohostil_app_network; then
    error_exit "Falha ao criar a rede overlay. Verifique se o Swarm está funcionando corretamente."
fi

# Deploy do stack
echo "🚀 Deployando stack..."
if ! docker stack deploy -c docker-compose.yml agendaladohostil; then
    error_exit "Falha ao fazer deploy do stack. Verifique os logs acima para mais detalhes."
fi

echo "⏳ Aguardando serviços iniciarem..."
sleep 10

echo "📊 Status dos serviços:"
if ! docker service ls; then
    error_exit "Falha ao listar serviços. Verifique se o Swarm está funcionando corretamente."
fi

echo "✅ Deploy concluído! Acesse http://localhost"
echo "📝 Logs disponíveis em:"
echo "   - Nginx: nginx/logs/"
echo "   - Next.js: docker service logs agendaladohostil_nextjs" 