#!/bin/bash
sudo apt update -y
sudo apt install -y nodejs npm nginx git

# Clone full stack app
git clone https://github.com/yourusername/your-fullstack-app.git
cd your-fullstack-app

# Backend setup
cd backend
npm install
npm run build || true
nohup npm start &

# Frontend setup
cd ../frontend
npm install
npm run build
sudo rm -rf /var/www/html/*
sudo cp -r build/* /var/www/html/

# Configure Nginx for frontend + proxy to backend
sudo bash -c 'cat > /etc/nginx/sites-available/default <<EOF
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index index.html;
    location /api/ {
        proxy_pass http://localhost:3000/;
    }
    location / {
        try_files \$uri /index.html;
    }
}
EOF'

sudo systemctl restart nginx
sudo systemctl enable nginx
