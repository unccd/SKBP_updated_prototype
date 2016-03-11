@echo off

rem ensure environment variables only exist in this space
setlocal

if '%1'=='--help'  goto Usage
if '%1'=='-help'  goto Usage
if '%1'=='/?'  goto Usage

goto ProcessRequest

:Usage

echo Usage:
echo      removeService [^<service name^>]
echo.
echo    ^<service name^>   Defaults to AspireService
echo.
echo Notes:
echo 1. You must run this command as a windows administrator.
echo    (right-click on a DOS shell icon and select "Run as Administrator")
echo.
echo 2. This program must be run with your current directory set to your Aspire
echo    home directory, OR ASPIRE_HOME/bin of the Aspire distribution you wish
echo    to install.
echo.
exit/B 0

:ProcessRequest


REM
REM DETERMINE THE SERVICE NAME
REM (CAN BE PASSED AS AN ARGUMENT TO THE SCRIPT)
REM 

set ARG1=%1
if not defined ARG1 goto :NoArg 

set ASPIRE_SERVICE_NAME=%1
goto ArgCheckComplete

:Noarg
set ASPIRE_SERVICE_NAME=AspireService

:ArgCheckComplete

echo Windows Service Name:  %ASPIRE_SERVICE_NAME%
echo.


sc delete %ASPIRE_SERVICE_NAME%

echo Service %ASPIRE_SERVICE_NAME% deleted.

