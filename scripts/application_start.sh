#!/bin/bash

# Give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/backend

# Navigate into our working directory where we have all our GitHub files
cd /home/ec2-user/backend

# Add npm and node to path
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in the path now)

# Install Node modules
sudo npm install

# Start our Node app with PM2
# sudo pm2 start npm --name api -- run dev

# Restart our node app with PM2
sudo pm2 restart api
