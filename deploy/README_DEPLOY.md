# Deployment Guide (Ubuntu VPS)

Follow these steps to deploy your application on a fresh Ubuntu 22.04 VPS (AWS Lightsail, DigitalOcean, etc.).

## 1. Initial Server Setup

SSH into your server:

```bash
ssh ubuntu@your-server-ip
```

Update the system:

```bash
sudo apt update && sudo apt upgrade -y
```

Install necessary packages:

```bash
sudo apt install python3-pip python3-venv nginx unzip -y
```

## 2. Install Node.js (for building Frontend)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 3. Setup Project

Clone your repository (or upload your code):

```bash
git clone <YOUR_REPO_URL> vega-market-edge-main
cd vega-market-edge-main
```

## 4. Backend Setup

Navigate to backend directory:

```bash
cd vegaBackendServer
```

Create virtual environment and install dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

_(Note: If you don't have a requirements.txt, generate it locally with `pip freeze > requirements.txt` and push it)_

Create your `.env` file:

```bash
nano .env
# Paste your .env content here
```

## 5. Frontend Setup

Navigate to root directory and install dependencies:

```bash
cd ..
npm install
```

Build the frontend:

```bash
npm run build
```

Move the build files to Nginx web root:

```bash
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
```

## 6. Configure Nginx

Copy the provided nginx config:

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/default
```

Test and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 7. Configure Backend Service

Copy the systemd service file:

```bash
sudo cp deploy/vega-backend.service /etc/systemd/system/
```

Start and enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl start vega-backend
sudo systemctl enable vega-backend
```

## 8. Done!

Visit `http://your-server-ip` in your browser. Your app should be live!

---

### Troubleshooting

- **Backend Logs:** `sudo journalctl -u vega-backend -f`
- **Nginx Logs:** `sudo tail -f /var/log/nginx/error.log`
