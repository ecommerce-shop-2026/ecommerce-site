#!/usr/bin/env python3
# Write Nginx config for ShopEasy and reload nginx
import os
import subprocess

config = r"""server {
    listen 80;
    server_name shopeasy.local;
    root /var/www/shopeasy;
    index index.html;

    access_log /var/log/nginx/shopeasy_access.log;
    error_log /var/log/nginx/shopeasy_error.log;

    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options nosniff always;

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.(json)$ {
        expires -1;
        add_header Cache-Control "no-store, must-revalidate";
    }

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    location ~ /\. {
        deny all;
        access_log off;
    }

    client_max_body_size 64M;
}
"""

with open("/etc/nginx/sites-available/shopeasy", "w") as f:
    f.write(config)

# Enable site
os.symlink("/etc/nginx/sites-available/shopeasy", "/etc/nginx/sites-enabled/shopeasy")

# Test and reload
result = subprocess.run(["nginx", "-t"], capture_output=True, text=True)
print("nginx test:", result.stdout, result.stderr)

subprocess.run(["service", "nginx", "reload"], check=True)
print("Nginx reloaded successfully")
