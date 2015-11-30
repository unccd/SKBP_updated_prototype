@echo off

rem ensure environment variables only exist in this space
setlocal

if not defined ASPIRE_HOME goto noHome

if exist "%ASPIRE_HOME%" goto Home

:noHome

if exist bundles\aspire goto SetThisDir

if exist ..\bundles\aspire goto SetParentDir

echo "Unable to determine the location of ASPIRE_HOME."
echo "Either set your working directory to the installation directory, or set the ASPIRE_HOME environment variable."
GOTO:EOF

:SetThisDir
set ASPIRE_HOME=%CD%
goto Home

:SetParentDir
cd ..
set ASPIRE_HOME=%CD%
goto Home

:Home

cd %ASPIRE_HOME%

if exist bundles\aspire goto HomeOkay

echo "Aspire Home is not set properly. It should be set to the Aspire installation directory."
echo "Check your ASPIRE_HOME environment variable or your installation."
GOTO:EOF

:HomeOkay

rem Check if encryptionApp.xml exists

if exist bin\encryptionApp.xml goto AppOkay

echo "Cannot find encryptionApp.xml on folder bin. Make sure you are running the script on the TARGET folder of the distribution."
GOTO:EOF

:AppOkay
bin\aspiresh.bat bin\encryptionApp.xml