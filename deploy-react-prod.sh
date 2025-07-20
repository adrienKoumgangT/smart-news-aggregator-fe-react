#!/bin/bash

set -e

APP_DIR="/var/www/your-app"
NGINX_CONF="/etc/nginx/sites-available/your-app"

echo "Installing dependencies and building..."
npm install
npm run build

echo "Moving build to $APP_DIR"
sudo mkdir -p "$APP_DIR"
sudo cp -r dist/* "$APP_DIR"

echo "Setting up NGINX config..."
sudo tee "$NGINX_CONF" > /dev/null <<EOL
server {
    listen 80;
    server_name _;

    root $APP_DIR;
    index index.html;

    location / {
        try_files \$uri /index.html;
    }
}
EOL

echo "Enabling site..."
sudo ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/your-app

echo "Reloading NGINX..."
sudo nginx -t && sudo systemctl reload nginx

echo "Deployed at http://localhost"
