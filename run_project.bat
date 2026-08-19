@echo off
setlocal EnableExtensions

set "ROOT=D:\Tech_Army-main final\Tech_Army-main"
set "BACKEND=%ROOT%\Tech_Army"
set "FRONTEND=%ROOT%\Tech_Army\tech_army_frontend\my-app"
set "VENV=D:\Tech_Army-main final\.venv"

start "Tech Army Backend" cmd /k "cd /d \"%BACKEND%\" && \"%VENV%\Scripts\python.exe\" manage.py runserver 0.0.0.0:8000"
start "Tech Army Frontend" cmd /k "cd /d \"%FRONTEND%\" && npm start"

echo Backend and frontend launching...
echo Open: http://127.0.0.1:3000/
