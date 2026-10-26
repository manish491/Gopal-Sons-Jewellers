#!/usr/bin/env bash
# Usage: ./set-domain.sh www.yourdomain.com
# Replaces the YOUR-DOMAIN.COM placeholder in canonical links, social tags, sitemap and robots.txt.
set -e
[ -z "$1" ] && { echo "Usage: $0 www.yourdomain.com"; exit 1; }
D="${1#https://}"; D="${D%/}"
for f in index.html privacy.html terms.html sitemap.xml robots.txt; do
  sed -i.bak "s/YOUR-DOMAIN\.COM/$D/g" "$f" && rm -f "$f.bak"
done
echo "Done. Domain set to https://$D"
