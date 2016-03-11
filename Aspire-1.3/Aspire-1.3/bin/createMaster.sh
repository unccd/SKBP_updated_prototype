#!/bin/sh
#
# Wrapper script to start FELIX
#
# USAGE: encryptPassword.sh
#

# Set the java options
JAVA_OPT="$JAVA_OPT -Xmx1024m"

# get the directory of the script
SCRIPT=`readlink -f $0`
SCRIPT_DIR=`dirname $SCRIPT`
SCRIPT_PARENT_DIR=`dirname $SCRIPT_DIR`

# default the aspire home if it's not set.
# the default will assume this script is in the bin directory under
# $ASPIRE_HOME and work back from there.

if [ "${ASPIRE_HOME}" = "" ]
then
  # Set ASPIRE_HOME to the next directory up
  export ASPIRE_HOME=$SCRIPT_PARENT_DIR
fi

# Startup
cd ${ASPIRE_HOME}
rm -rf cache >/dev/null 2>&1
java ${JAVA_OPT} -Dcom.searchtechnologies.aspire.home=$ASPIRE_HOME -classpath bundles/aspire/aspire-application-1.2-SNAPSHOT.jar com.searchtechnologies.aspire.security.CreateMaster
