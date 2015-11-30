#!/bin/sh
#
# Wrapper script to start FELIX
#
# USAGE: startup.sh
#

# Set the java options
JAVA_OPT="$JAVA_OPT -Xmx4096m"

# get the directory of the script
SCRIPT=`readlink -f $0`
SCRIPT_DIR=`dirname $SCRIPT`
SCRIPT_PARENT_DIR=`dirname $SCRIPT_DIR`

# set the filename for the pid file
pid_file=${SCRIPT_DIR}/felix.pid

# check if the pid file exists
if [ -f ${pid_file} ]
then
  # it does. Felix is probable already running
  read pid < $pid_file

  # check if the pid is still running
  kill -0 $pid >/dev/null 2>&1
  if [ $? -ne 0 ]
  then
    echo "FELIX was running under process id $pid but appears to have failed"
  else
    echo "FELIX appears to be running already under process id $pid"
    exit 1
  fi
fi

# default the aspire home if it's not set.
# the default will assume this script is in the bin directory under
# $ASPIRE_HOME and work back from there.

if [ "${ASPIRE_HOME}" = "" ]
then
  # Set ASPIRE_HOME to the next directory up
  export ASPIRE_HOME=$SCRIPT_PARENT_DIR
fi

# set the log file
if [ -d "${ASPIRE_LOG_DIR}" ]
then
  felix_log=${ASPIRE_LOG_DIR}/felix.log
elif [ -d "${ASPIRE_HOME}/log" ]
then
  felix_log=${ASPIRE_HOME}/log/felix.log
else
  felix_log=${ASPIRE_HOME}/felix.log
fi

echo "#"
echo "# ASPIRE_HOME: ${ASPIRE_HOME}"
echo "#"
echo "# FELIX_LOG:   ${felix_log}"
echo "#"

# set the log dir
if [ -d "${ASPIRE_LOG_DIR}" ]
then
  log_prop="-Dcom.searchtechnologies.aspire.log.directory=$ASPIRE_LOG_DIR"
fi

# Startup
cd ${ASPIRE_HOME}
rm -rf cache >/dev/null 2>&1

nohup java ${JAVA_OPT} -Dfelix.config.properties=file:config/felix.properties -Dcom.searchtechnologies.aspire.home=$ASPIRE_HOME $log_prop -jar ${SCRIPT_DIR}/felix.jar >> ${felix_log} 2>&1 &

# Write the pid to the pid file
echo "FELIX started as PID: $!"
echo $! > $pid_file
