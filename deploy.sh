#!/bin/bash

#PRODUCTION
git reset --hard
git chechout master
git pull origin master

docker compose up -d