#!/bin/bash

# create production build of client
cd client
npm run build

# compress and send to server
cd ..
tar -czf build.tgz client/build
scp -i $SERVER_KEY_PATH build.tgz $SERVER_USERNAME@$SERVER_IP:population-visualizer/
rm build.tgz

# commit changes to github
git add .
git commit -m "$*"
git push origin main


ssh -i $SERVER_KEY_PATH $SERVER_USERNAME@$SERVER_IP 'bash -s' <<'ENDSSH'
  cd population-visualizer
  git pull
  tar -xvf build.tgz
  rm build.tgz
  source pop_app_env/bin/activate
  kill $(pgrep waitress)
  export FLASK_ENV=production
  waitress-serve --call 'app:create_app'
ENDSSH