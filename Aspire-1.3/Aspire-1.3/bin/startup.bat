@echo off

rem ensure environment variables only exist in this space
setlocal

if not defined ASPIRE_HOME goto noHome

if exist "%ASPIRE_HOME%" goto Home

:noHome

if exist bundles\aspire goto SetThisDir

if exist ..\bundles\aspire goto SetParentDir

echo Unable to determine the location of ASPIRE_HOME.
echo Either set your working directory to the installation directory, or set the ASPIRE_HOME environment variable.
exit /b 0

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

echo Aspire Home is not set properly. It should be set to the Aspire installation directory.
echo Check your ASPIRE_HOME environment variable or your installation.
exit /b 0

:HomeOkay

echo Removing Felix-Cache and AppBundle-Cache directories
rmdir /s /q cache >:nul 2>&1

set felix_start_prop=-Dfelix.config.properties=file:config/felix.properties
set felix_start_prop=%felix_start_prop% "-Dcom.searchtechnologies.aspire.home=%ASPIRE_HOME%"
set felix_start_prop=%felix_start_prop% "-Dcom.searchtechnologies.aspire.shell.directory=%ASPIRE_HOME%"
if defined ASPIRE_LOG_DIR set felix_start_prop=%felix_start_prop% "-Dcom.searchtechnologies.aspire.log.directory=%ASPIRE_LOG_DIR%"

java -Xms2048m -Xmx8194m -XX:MaxPermSize=256m -XX:+ParallelRefProcEnabled -XX:+AggressiveOpts -XX:+CMSClassUnloadingEnabled -XX:+UseConcMarkSweepGC %felix_start_prop% -jar bin\felix.jar
