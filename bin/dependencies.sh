#!/bin/bash

sudo apt-get install python3-pip nodejs npm
sudo pip3 install yoyo-migrations pymysql
git clone https://github.com/rexington/quick2wire-gpio-admin.git -b fixpath --single-branch
cd quick2wire-gpio-admin
make
sudo make install
sudo adduser $USER gpio

sudo apt-get install mysql-server

echo "I recommend installing https://play.google.com/store/apps/details?id=fr.herverenault.selfhostedgpstracker and pointing it to /gps. Interval should be less than 5 minutes."
