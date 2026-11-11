#!/usr/bin/env bash
# Script de reactivación y recuperación del backend en GCP
set -e

echo "====================================================="
echo "🏥 Reactivando Jóvenes con Salud en GCP VM"
echo "====================================================="

# 1. Asegurar que PostgreSQL esté activo y habilitado al inicio
echo "➔ Verificando y levantando PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql --no-pager | head -n 8

# 2. Navegar al directorio del servidor
echo "➔ Localizando directorio del proyecto..."
if [ -d "$HOME/app/server" ]; then
  cd "$HOME/app/server"
elif [ -d "$HOME/jovenes-con-salud/server" ]; then
  cd "$HOME/jovenes-con-salud/server"
elif [ -d "/var/www/jovenes-con-salud/server" ]; then
  cd "/var/www/jovenes-con-salud/server"
else
  echo "⚠️ No se encontró la ruta estándar. Buscando repositorio..."
  DIR=$(find / -name "server.js" -path "*/server/*" 2>/dev/null | head -n 1)
  if [ -n "$DIR" ]; then
    cd "$(dirname "$DIR")"
  else
    echo "❌ No se encontró la carpeta del backend. Ejecuta el comando dentro del directorio del server."
    exit 1
  fi
fi

# Traer últimos cambios de imágenes y scripts
echo "➔ Actualizando repositorio..."
git pull origin main || git pull origin master || true

# 3. Levantar backend con PM2
echo "➔ Reactivando servicio de Node.js en PM2..."
pm2 restart heartbiss-api || pm2 restart jcs-backend || pm2 start server.js --name "heartbiss-api"
pm2 save

# 4. Habilitar PM2 en systemd para que NUNCA vuelva a caerse al reiniciar la VM
echo "➔ Configurando persistencia automática ante reinicios..."
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || pm2 startup || true
pm2 save

# 5. Reiniciar Nginx
echo "➔ Verificando y reiniciando Nginx..."
sudo nginx -t
sudo systemctl restart nginx

echo "====================================================="
echo "✅ ¡Servidor reactivado exitosamente!"
echo "➔ Verificando respuesta interna:"
curl -s http://localhost:3001/api/health || echo "⚠️ Revisa los logs con: pm2 logs jcs-backend"
echo ""
echo "====================================================="
