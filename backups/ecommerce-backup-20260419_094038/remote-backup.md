# 远程备份配置指南

## 1. 备份到 AWS S3
```bash
# 安装 AWS CLI
pip install awscli

# 配置
aws configure

# 上传备份
aws s3 sync backups/ s3://your-bucket-name/ecommerce-backups/
```

## 2. 备份到 Google Cloud Storage
```bash
# 安装 gcloud CLI
curl https://sdk.cloud.google.com | bash

# 配置
gcloud init

# 上传备份
gsutil -m cp -r backups/* gs://your-bucket-name/ecommerce-backups/
```

## 3. 备份到 Dropbox
```bash
# 使用 rclone
rclone config
rclone sync backups/ dropbox:ecommerce-backups/
```

## 4. 备份到 GitHub
```bash
# 创建备份仓库
git init backup-repo
cd backup-repo
git remote add origin https://github.com/yourname/ecommerce-backups.git

# 添加备份
cp -r ../backups/ecommerce-backup-* .
git add .
git commit -m "Backup $(date)"
git push origin main
```

## 5. 自动同步脚本
创建 `sync-backup.sh`：
```bash
#!/bin/bash
# 同步备份到远程

BACKUP_DIR="backups"
LATEST_BACKUP=$(ls -td $BACKUP_DIR/ecommerce-backup-* | head -1)

# 同步到 S3
aws s3 sync $LATEST_BACKUP s3://your-bucket/ecommerce-backups/latest/

# 发送通知
echo "备份已同步到远程" | mail -s "备份同步完成" admin@example.com
```

## 6. 监控备份状态
- 设置日志监控
- 配置报警通知
- 定期验证备份完整性
