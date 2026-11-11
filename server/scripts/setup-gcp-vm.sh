#!/usr/bin/env bash
# ==============================================================================
# Script de instalación automática para VM e2-micro (Ubuntu/Debian) en Google Cloud
# Instala: Swap (1GB para evitar falta de RAM en e2-micro), Node.js 20,
#          PostgreSQL, PM2 y Caddy (HTTPS automático con nip.io para Vercel)
# ==============================================================================
set -e

echo "🚀 [1/7] Configurando memoria Swap de 1GB (ideal para e2-micro 1GB RAM)..."
if [ ! -f /swapfile ]; then
  sudo fallocate -l 1G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=1024
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

echo "📦 [2/7] Actualizando paquetes e instalando dependencias base..."
sudo apt-get update -y
sudo apt-get install -y curl git gnupg ca-certificates openssl

echo "🟢 [3/7] Instalando Node.js 20 LTS y PM2..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
sudo npm install -g pm2

echo "🐘 [4/7] Instalando y configurando PostgreSQL..."
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

DB_NAME="jovenes_con_salud_prod"
DB_USER="heartbiss_user"
DB_PASS="HeartBiss_2026_Secure!"

(
  cd /tmp
  sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"

  sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
    sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

  sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
  sudo -u postgres psql -d "${DB_NAME}" -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"
)

echo "📥 [5/7] Clonando o actualizando repositorio desde GitHub..."
APP_DIR="$HOME/app"
REPO_URL="https://github.com/BlackCharlesX/-HeartBiss-Cuida-Tu-Corazon-.git"

if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
  git fetch origin main
  git reset --hard origin/main
else
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi

cd "$APP_DIR/server"
mkdir -p public/uploads/apk public/images/uploads
npm install --omit=dev

FIRST_INSTALL=false
if [ ! -f .env ]; then
  FIRST_INSTALL=true
  JWT_RANDOM=$(openssl rand -hex 32)
  cat <<EOF > .env
PORT=3001
NODE_ENV=production
CLIENT_URL=*
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASS}
DB_SYNC=true
JWT_SECRET=${JWT_RANDOM}
JWT_EXPIRES_IN=7d
EOF
  echo "✅ Archivo .env de producción generado."
fi

echo "⚙️ [6/7] Iniciando API con PM2..."
if [ "$FIRST_INSTALL" = true ]; then
  echo "🌱 Sembrando datos iniciales en la base de datos..."
  npm run seed || true
fi

pm2 delete heartbiss-api 2>/dev/null || true
pm2 start server.js --name heartbiss-api
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u "$USER" --hp "$HOME" | tail -n 1 | sudo bash || true

# Crear script de auto-actualización desde GitHub (cron cada 1 minuto + soporte SSH para GitHub Actions)
sudo apt-get install -y cron || true
sudo systemctl enable cron || true
sudo systemctl start cron || true

cat << 'EOF' > "$HOME/auto-update.sh"
#!/usr/bin/env bash
export PATH=$PATH:/usr/bin:/usr/local/bin
cd "$HOME/app" || exit 0
git fetch origin main --quiet
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
if [ "$LOCAL" != "$REMOTE" ]; then
  echo "[$(date)] Detectada nueva versión ($REMOTE). Actualizando..."
  git reset --hard origin/main
  cd "$HOME/app/server"
  mkdir -p public/uploads/apk public/images/uploads
  npm install --omit=dev
  pm2 restart heartbiss-api
  echo "[$(date)] Actualización completada."
fi
EOF
chmod +x "$HOME/auto-update.sh"
(crontab -l 2>/dev/null | grep -v "auto-update.sh"; echo "* * * * * $HOME/auto-update.sh >> $HOME/auto-update.log 2>&1") | crontab -

# Asegurar que Google Cloud OS Login / Guest Agent permita la llave SSH de GitHub Actions
if [ -f "$HOME/.ssh/github_actions.pub" ]; then
  cp "$HOME/.ssh/github_actions.pub" "$HOME/.ssh/authorized_keys_github"
  chmod 600 "$HOME/.ssh/authorized_keys_github"
  chmod 700 "$HOME/.ssh"
  sudo tee /etc/ssh/sshd_config.d/99-github-actions.conf > /dev/null <<EOF
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys .ssh/authorized_keys_github
EOF
  sudo systemctl reload ssh || sudo systemctl reload sshd || true
fi

echo "🔒 [7/7] Instalando Caddy para HTTPS gratuito automático (requerido por Vercel)..."
if ! command -v caddy &> /dev/null; then
  sudo apt-get install -y caddy
fi

EXTERNAL_IP=$(curl -s https://ifconfig.me)
NIP_DOMAIN="${EXTERNAL_IP}.nip.io"

sudo tee /etc/caddy/Caddyfile > /dev/null <<EOF
${NIP_DOMAIN} {
    reverse_proxy localhost:3001
}
EOF

sudo systemctl enable caddy
sudo systemctl restart caddy

echo "=================================================================="
echo "🎉 ¡BACKEND DESPLEGADO Y CORRIENDO CON ÉXITO!"
echo "🌐 URL HTTPS para poner en Vercel (VITE_API_URL):"
echo "   https://${NIP_DOMAIN}/api"
echo "🩺 Health Check:"
echo "   https://${NIP_DOMAIN}/api/health"
echo "🔑 Acceso Admin por defecto:"
echo "   admin@ijt.gob.mx / Admin@JCS2026!"
echo "=================================================================="

