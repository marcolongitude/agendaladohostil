This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Agendaladohostil

## Rodando com Docker Swarm (Linux)

Este projeto está pronto para ser executado em produção local ou servidor Linux usando Docker Swarm, com balanceamento de carga via Nginx e múltiplas instâncias do Next.js.

### Pré-requisitos

-   Docker instalado
-   Permissão para rodar comandos como sudo/root (se necessário)
-   Porta 8080 disponível no host

### Estrutura dos containers

-   **nextjs**: 4 réplicas da aplicação Next.js (porta interna 3000)
-   **nginx**: Proxy reverso e balanceador de carga (porta externa 8080)
-   **Rede overlay**: Comunicação entre containers

### Passo a passo

1. **Clone o repositório e acesse a pasta do projeto:**

    ```bash
    git clone <repo-url>
    cd agendaladohostil
    ```

2. **Dê permissão de execução ao script de deploy:**

    ```bash
    chmod +x deploy.sh
    ```

3. **Execute o deploy:**

    ```bash
    ./deploy.sh
    ```

    O script irá:

    - Verificar se o Docker está instalado e rodando
    - Inicializar o Docker Swarm (se necessário)
    - Criar os diretórios necessários
    - Construir a imagem Docker
    - Fazer o deploy do stack

4. **Acompanhe o status dos serviços:**

    ```bash
    docker service ls
    ```

5. **Acesse a aplicação:**

    - Abra o navegador e acesse: [http://localhost:8080](http://localhost:8080)

6. **Ver logs:**

    - Logs do Nginx: `nginx/logs/`
    - Logs do Next.js: `docker service logs agendaladohostil_nextjs`

7. **Escalar instâncias (opcional):**

    ```bash
    docker service scale agendaladohostil_nextjs=6
    ```

8. **Remover o stack:**
    ```bash
    docker stack rm agendaladohostil
    docker network rm agendaladohostil_app_network
    ```

### Observações

-   O script `deploy.sh` faz todas as verificações necessárias e inicializa o Swarm automaticamente
-   O build da imagem Next.js é feito automaticamente pelo script
-   O Nginx faz o balanceamento de carga entre as instâncias Next.js
-   A rede overlay é criada automaticamente para comunicação entre os serviços
-   A aplicação é acessível na porta 8080 do host
-   Para ambiente de produção, configure variáveis de ambiente e SSL conforme necessário

### Troubleshooting

Se encontrar algum erro durante o deploy:

1. Verifique se o Docker está instalado e rodando:

    ```bash
    docker --version
    docker info
    ```

2. Verifique se você tem permissões suficientes:

    ```bash
    sudo usermod -aG docker $USER
    # Faça logout e login novamente
    ```

3. Se o Swarm não inicializar, tente:

    ```bash
    docker swarm leave --force
    docker swarm init
    ```

4. Se a porta 8080 já estiver em uso:

    ```bash
    # Verifique qual processo está usando a porta
    sudo lsof -i :8080
    # Ou
    sudo netstat -tulpn | grep 8080
    ```

5. Para mais informações sobre erros específicos, consulte os logs:
    ```bash
    docker service logs agendaladohostil_nextjs
    docker service logs agendaladohostil_nginx
    ```

### Comandos Úteis para Gerenciamento

#### Verificação do Ambiente

```bash
# Verificar versões do Docker
docker --version
docker-compose --version

# Verificar status do Swarm
docker node ls
docker info

# Verificar portas em uso
sudo lsof -i :8080
# ou
sudo netstat -tulpn | grep 8080
```

#### Gerenciamento de Serviços

```bash
# Listar todos os serviços
docker service ls

# Ver detalhes de um serviço específico
docker service ps agendaladohostil_nextjs
docker service ps agendaladohostil_nginx

# Escalar número de réplicas
docker service scale agendaladohostil_nextjs=6

# Atualizar um serviço
docker service update --image agendaladohostil:latest agendaladohostil_nextjs

# Remover um serviço específico
docker service rm agendaladohostil_nextjs
```

#### Monitoramento e Logs

```bash
# Ver logs em tempo real
docker service logs -f agendaladohostil_nextjs
docker service logs -f agendaladohostil_nginx

# Ver logs com timestamps
docker service logs --timestamps agendaladohostil_nextjs

# Ver últimas N linhas de log
docker service logs --tail 100 agendaladohostil_nextjs

# Ver containers em execução
docker ps
docker ps -a  # inclui containers parados
```

#### Gerenciamento de Rede

```bash
# Listar redes
docker network ls

# Inspecionar rede
docker network inspect agendaladohostil_app_network

# Remover rede
docker network rm agendaladohostil_app_network
```

#### Gerenciamento de Imagens

```bash
# Listar imagens
docker images

# Remover imagem
docker rmi agendaladohostil:latest

# Forçar remoção de imagem
docker rmi -f agendaladohostil:latest
```

#### Limpeza e Reinicialização

```bash
# Remover stack completo
docker stack rm agendaladohostil

# Remover rede
docker network rm agendaladohostil_app_network

# Remover imagens não utilizadas
docker image prune -a

# Reiniciar Swarm
docker swarm leave --force
docker swarm init
```

#### Comandos de Debug

```bash
# Ver detalhes de um container
docker inspect <container_id>

# Ver uso de recursos
docker stats

# Ver eventos do Docker
docker events

# Ver informações do sistema
docker system df
docker system info
```

#### Comandos Úteis para Desenvolvimento

```bash
# Reconstruir e atualizar um serviço
docker-compose build nextjs
docker service update --force agendaladohostil_nextjs

# Ver variáveis de ambiente de um container
docker exec <container_id> env

# Acessar shell de um container
docker exec -it <container_id> /bin/sh

# Copiar arquivos para/do container
docker cp <container_id>:/path/to/file ./local/path
docker cp ./local/file <container_id>:/path/to/destination
```

#### Dicas de Segurança

```bash
# Verificar permissões do socket do Docker
ls -l /var/run/docker.sock

# Adicionar usuário ao grupo docker (evita uso de sudo)
sudo usermod -aG docker $USER
# Faça logout e login novamente para aplicar

# Verificar configurações de segurança
docker info | grep "Security"
```

---

Se tiver dúvidas ou problemas, abra uma issue ou entre em contato!
