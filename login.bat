@echo off
echo Opening login page...
start chrome simple-login.html
if errorlevel 1 start firefox simple-login.html
if errorlevel 1 start msedge simple-login.html
if errorlevel 1 start simple-login.html
pause