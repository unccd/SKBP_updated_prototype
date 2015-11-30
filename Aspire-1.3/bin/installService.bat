@echo off

rem ensure environment variables only exist in this space
setlocal

if '%1'=='--help'  goto Usage
if '%1'=='-help'  goto Usage
if '%1'=='/?'  goto Usage

goto ProcessRequest

:Usage

echo Usage:
echo      installService [^<service name^>]
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

rem **********************************************************************************
rem *
rem * Default java path and service name
rem *
rem **********************************************************************************

set DEFAULT_JAVA_HOME=C:\Program Files\Java\jdk1.7.0_80\jre
set DEFAULT_SERVICE_NAME=AspireService

rem **********************************************************************************
rem *
rem * Other variables (should not be changed)
rem *
rem **********************************************************************************
set PROCRUN_LOGFILE_PREFIX=procrun

rem **********************************************************************************
rem *
rem * Determine the PROCRUN command to run (based on Windows environment variable PROCESSOR_ARCHITECTURE.
rem *
rem **********************************************************************************

echo Current System Architecture: %PROCESSOR_ARCHITECTURE%
set PROCRUN_64BIT_DIR=%PROCESSOR_ARCHITECTURE%\

rem **********************************************************************************
rem *
rem * DETERMINE THE SERVICE NAME
rem * (CAN BE PASSED AS AN ARGUMENT TO THE SCRIPT)
rem *
rem **********************************************************************************

set ARG1=%1
if not defined ARG1 goto :NoArg 

set ASPIRE_SERVICE_NAME=%1
goto ArgCheckComplete

:Noarg
set ASPIRE_SERVICE_NAME=%DEFAULT_SERVICE_NAME%

:ArgCheckComplete

echo Windows Service Name:  %ASPIRE_SERVICE_NAME%


rem **********************************************************************************
rem *
rem * DETERMINE ASPIRE HOME
rem *
rem **********************************************************************************

if not defined ASPIRE_HOME goto noHome

if exist "%ASPIRE_HOME%" goto Home

:noHome

if exist bundles\aspire goto SetThisDir

if exist ..\bundles\aspire goto SetParentDir

echo.
echo Unable to determine the location of ASPIRE_HOME.
echo Either set your working directory to the installation directory, or set the ASPIRE_HOME environment variable.
exit/B 0

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

echo.
echo Aspire Home is not set properly. It should be set to the Aspire installation directory.
echo Check your ASPIRE_HOME environment variable or your installation.
exit/B 0

:HomeOkay

echo Aspire Home:  %ASPIRE_HOME%

rem Set the log file directory
set ASPIRE_LOG=%ASPIRE_HOME%\log


rem ********************************************************
rem *
rem * CHECK FOR THE ASPIRE WINDOWS SERVICE EXECUTABLE
rem *
rem ********************************************************

set PRUNSRV_PATH=%ASPIRE_HOME%\bin\prunsrv\%PROCRUN_64BIT_DIR%prunsrv.exe

if exist "%PRUNSRV_PATH%" goto HaveService

echo.
echo Your distribution is missing the prunsrv.exe executable.
echo You will need to obtain a copy of this program and add it to your distribution.
exit/B 0

:HaveService

rem ********************************************************
rem *
rem * Check / default JAVA_HOME
rem *
rem ********************************************************

echo.

if defined JAVA_HOME goto HaveJavaHome

echo The JAVA_HOME variable is not set.
echo Set JAVA_HOME to the version of Java you wish to install and then re-execute this script.
exit/B 0

:HaveJavaHome
rem JAVA_HOME now set

rem Now set the JVM and check that it exists
set JAVA_JVM=%JAVA_HOME%\jre\bin\server\jvm.dll
if exist "%JAVA_JVM%" goto HaveJavaVM

set JAVA_JVM=%JAVA_HOME%\bin\server\jvm.dll
if exist "%JAVA_JVM%" goto HaveJavaVM

echo.
echo Cannot find the Java VM server executeable.
echo Check your JAVA_HOME environment variable (currently %JAVA_HOME%)
echo or check that your Java installation is complete.
exit/B 0



:HaveJavaVM
echo Java VM:  %JAVA_JVM%

rem Set the felix properties


set JAVA_PROPS_PRUNSRV=-Xrs#-Dfelix.config.properties=file:config/felix.properties#-Dcom.searchtechnologies.aspire.home=%ASPIRE_HOME%#-XX:PermSize=128m


rem ********************************************************
rem *
rem * Install
rem *
rem ********************************************************

echo Creating Service...
echo.

"%PRUNSRV_PATH%" //IS//%ASPIRE_SERVICE_NAME% --Install="%PRUNSRV_PATH%" --DisplayName="%ASPIRE_SERVICE_NAME%" --Startup=manual --StartPath="%ASPIRE_HOME%" --JavaHome="%JAVA_HOME%" --LibraryPath="%JAVA_HOME%\bin" --Jvm="%JAVA_JVM%" --JvmOptions="%JAVA_PROPS_PRUNSRV%" --JvmMs=2048 --JvmMx=8194 --Classpath="%ASPIRE_HOME%\bin\felix.jar" --StartMode=jvm --StartClass=org.apache.felix.main.Main --StopMode=exe --StopImage="%ASPIRE_HOME%\bin\shutdown.exe" --StopParams="%ASPIRE_HOME%\config\felix.properties" --StopTimeout=30 --LogPath="%ASPIRE_LOG%" --LogPrefix=%PROCRUN_LOGFILE_PREFIX% --StdOutput="%ASPIRE_LOG%\%ASPIRE_SERVICE_NAME%-stdout.log" --StdError="%ASPIRE_LOG%\%ASPIRE_SERVICE_NAME%-stderr.log"

rem ********************************************************
rem *
rem * Report success or failure
rem *
rem ********************************************************

echo.

if errorlevel 1 GOTO failed

echo Service %ASPIRE_SERVICE_NAME% created.
goto end

:failed
echo FAILED - Service %ASPIRE_SERVICE_NAME% was not created.
echo.
echo Please check the %PROCRUN_LOGFILE_PREFIX% log file for today in %ASPIRE_LOG%

:end
echo.

