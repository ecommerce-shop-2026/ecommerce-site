import os
import base64
import requests

# Read the payment.html file
file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ecommerce-site', 'payment.html')
with open(file_path, 'rb') as f:
    content = f.read()

encoded = base64.b64encode(content).decode('utf-8')

# GitHub API endpoint
url = 'https://api.github.com/repos/ecommerce-shop-2026/ecommerce-site/contents/payment.html'

# Use session with cookies from browser
headers = {
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
}

data = {
    'message': '添加支付页面 payment.html',
    'content': encoded,
    'branch': 'main'
}

# Try using personal access token from environment or command line
import sys
token = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('GITHUB_TOKEN', '')

if token:
    headers['Authorization'] = f'token {token}'
    response = requests.put(url, headers=headers, json=data)
    print(f'Status: {response.status_code}')
    if response.status_code in [200, 201]:
        print('SUCCESS: payment.html uploaded!')
    else:
        print(f'Error: {response.text}')
else:
    print('No GitHub token provided.')
    print('Usage: python upload_payment.py YOUR_GITHUB_TOKEN')
    print('Or set GITHUB_TOKEN environment variable.')
    print()
    print('How to create a GitHub token:')
    print('1. Go to https://github.com/settings/tokens')
    print('2. Click "Generate new token (classic)"')
    print('3. Select "repo" scope')
    print('4. Copy the token and run this script again')
