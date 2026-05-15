#!/bin/bash

# Altiplano Database Backup Script
# Usage: ./scripts/backup-db.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="${BACKUP_DIR}/altiplano_backup_${TIMESTAMP}.sql"

mkdir -p "${BACKUP_DIR}"

echo "Starting database backup..."

if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL not set"
    exit 1
fi

pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

echo "Backup created: ${BACKUP_FILE}"

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup size: ${BACKUP_SIZE}"

RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-30}
echo "Cleaning up backups older than ${RETENTION_DAYS} days..."

find "${BACKUP_DIR}" -name "altiplano_backup_*.sql" -mtime +${RETENTION_DAYS} -delete

echo "Backup completed successfully!"