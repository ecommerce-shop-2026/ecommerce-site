# 备份报告

## 备份信息
- 备份时间: 2026年04月19日  9:40:40
- 备份名称: ecommerce-backup-20260419_094038
- 备份目录: backups/ecommerce-backup-20260419_094038
- 总大小: 72K

## 备份内容
网站文件备份: 52K
数据库: 无
配置文件: 2 个
Git 信息: 已备份
文件总数: 95
总备份大小: 72K

## 文件清单
共 95 个文件，前1000个文件：
```
./.git/COMMIT_EDITMSG
./.git/config
./.git/description
./.git/FETCH_HEAD
./.git/HEAD
./.git/hooks/applypatch-msg.sample
./.git/hooks/commit-msg.sample
./.git/hooks/fsmonitor-watchman.sample
./.git/hooks/post-update.sample
./.git/hooks/pre-applypatch.sample
./.git/hooks/pre-commit.sample
./.git/hooks/pre-merge-commit.sample
./.git/hooks/pre-push.sample
./.git/hooks/pre-rebase.sample
./.git/hooks/pre-receive.sample
./.git/hooks/prepare-commit-msg.sample
./.git/hooks/push-to-checkout.sample
./.git/hooks/sendemail-validate.sample
./.git/hooks/update.sample
./.git/index
...
```

## Git 状态
```
On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	backups/

nothing added to commit but untracked files present (use "git add" to track)
```

## 恢复说明
要恢复此备份，请运行：
```bash
chmod +x backups/ecommerce-backup-20260419_094038/restore.sh
backups/ecommerce-backup-20260419_094038/restore.sh backups/ecommerce-backup-20260419_094038
```

## 注意事项
1. 恢复前请确保有当前数据的备份
2. 恢复会覆盖现有文件
3. 恢复后请验证网站功能

---
*备份创建于: 2026年04月19日  9:40:40*
