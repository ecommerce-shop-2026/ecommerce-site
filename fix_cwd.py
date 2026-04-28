#!/usr/bin/env python3
"""Fix terminal working directory and clone the repo."""
import subprocess, os

# Fix: recreate the missing cwd
os.makedirs("/root/ecommerce-site", exist_ok=True)
print("Created /root/ecommerce-site")

# Now check git config
os.chdir("/root")
r = subprocess.run("cat .gitconfig", shell=True, capture_output=True, text=True)
print("=== .gitconfig ===")
print(r.stdout or "(empty)")
print(r.stderr or "")

r = subprocess.run("cat .git-credentials", shell=True, capture_output=True, text=True)
print("=== .git-credentials ===")
print(r.stdout[:300] if r.stdout else "(empty)")
print(r.stderr or "")

# Check ssh keys
r = subprocess.run("ls -la ~/.ssh/ 2>/dev/null", shell=True, capture_output=True, text=True)
print("=== ~/.ssh/ ===")
print(r.stdout or "(no .ssh dir)")
