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
exit 0

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
exit 0

:HomeOkay

echo Removing Felix-Cache and AppBundle-Cache directories
rmdir /s /q cache >:nul 2>&1

set FELIX_CONFIG_PROP=-Dfelix.config.properties=file:config/felix.properties 
set ASPIRE_HOME_PROP=-Dcom.searchtechnologies.aspire.home=%ASPIRE_HOME%
set ASPIRE_SHELL_DIRECTORY=-Dcom.searchtechnologies.aspire.shell.directory=%ASPIRE_HOME%
REM -Dcom.searchtechnologies.aspire.home=. org.apache.felix.main.Main -

echo.
echo ***********************************************************************
echo.
echo DEBUGGING SET
echo.
echo   In Eclipse, go to run/Debug Configurations,
echo   create a new remote java application,
echo   and attach to standard socket/localhost/8000
echo   Then set a breakpoint and run aspire until it hits the breakpoint
echo.
echo ***********************************************************************
echo.
java -Xdebug -Xrunjdwp:transport=dt_socket,address=8000,server=y,suspend=n -Xmx250m -Xms250m -XX:MaxPermSize=128m %FELIX_CONFIG_PROP% "%ASPIRE_HOME_PROP%" "%ASPIRE_SHELL_DIRECTORY%" -jar bin\felix.jar

