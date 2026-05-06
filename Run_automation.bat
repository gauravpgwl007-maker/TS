@echo off
echo ===============================
echo Starting Mobile Automation Run
echo ===============================

cd /d C:\Users\gwl\Documents\GWL_App_Automation

echo Starting Appium Server...
start /min cmd /c "appium -p 4723"

timeout /t 30

echo Running WDIO Tests...
npx wdio run wdio.conf.js --spec ./tests/specs/login.spec.js

echo Generating Allure Report...
npx allure generate allure-results --clean -o allure-report

echo Opening Allure Report...
start allure-report\index.html

echo ===============================
echo Execution Completed
echo ===============================
pause
