#!/bin/sh
#
# Wrapper script to shutdown FELIX
#
# USAGE: shutdown.sh
#

# The grace period in seconds before forcing a shutdown
grace=60

# get the directory of the script
SCRIPT=`readlink -f $0`
SCRIPT_DIR=`dirname $SCRIPT`

# set the filename for the pid file
pid_file=${SCRIPT_DIR}/felix.pid

# check if the pid file exists
if [ ! -f ${pid_file} ]
then
  # it does not. Felix is probably not running
  echo "FELIX does not appear to be running"
  exit 1
fi

# Shutdown
read pid < $pid_file

# check if the pid is still running
kill -0 $pid >/dev/null 2>&1
if [ $? -ne 0 ]
then
  echo "FELIX was running under process id $pid but appears to have failed"
else
  kill $pid >/dev/null 2>&1
  echo "Shutting down FELIX (PID: $pid)"
  
  # Wait to ensure the process dies
  i=1
  while [ $i -lt $grace ]
  do
    # check if the process is still there
    kill -0 $pid >/dev/null 2>&1
    if [ $? -ne 0 ]
    then
      # died
      break
    else
      echo -n .
    fi
    
    # sleep
    sleep 1
    i=`expr $i + 1`
  done
  
  # ensure the process is gone
  echo
  kill -0 $pid >/dev/null 2>&1
  if [ $? -eq 0 ]
  then
    # Still alive
    echo "FELIX did not shutdown in $grace seconds - forcing shutdown"
    kill -9 $pid >/dev/null 2>&1
  fi  	
fi

echo "FELIX shutdown (PID: $pid)"

# remove the file
rm -f $pid_file
