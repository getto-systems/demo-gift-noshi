#!/bin/sh

deploy_main(){
  local version
  version=$(cat .release-version)

  deploy_build_ui
  deploy_rewrite_version
  deploy_cp_public

  #deploy_cp_public_index "0.8.0"
}
deploy_build_ui(){
  npm run build
}
deploy_rewrite_version(){
  for file in $(find public/dist public/root -name '*.html'); do
    if [ -f "$file" ]; then
      sed -i -e "s|/dist/|/$version/|g" "$file"
    fi
  done
}
deploy_cp_public(){
  local metadata
  local file
  metadata=$(node public/metadata.js)

  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --metadata "$metadata" \
    --recursive \
    public/dist s3://$AWS_S3_PUBLIC_BUCKET/$version

  for file in public/root/*; do
    aws s3 cp \
      --acl private \
      --cache-control "public, max-age=86400" \
      --metadata "$metadata" \
      $file "s3://$AWS_S3_PUBLIC_BUCKET/$(basename $file)"
  done
}

deploy_cp_public_index(){
  # 歯抜けになってしまったパージョンのために index.html を埋める
  local metadata
  local file
  metadata=$(node public/metadata.js)

  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --metadata "$metadata" \
    public/dist/index.html s3://$AWS_S3_PUBLIC_BUCKET/$1/index.html
}

deploy_main
