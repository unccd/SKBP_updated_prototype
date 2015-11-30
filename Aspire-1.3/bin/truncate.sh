#!/bin/sh
#
# Wrapper script to truncate files with out affecting any process
# writing to it
#
# USAGE: truncate.sh <filename> [<filename> ...]
#

# check the parameter
if [ $# -lt 1 ]
then
    echo "USAGE: `basename $0` <filename> [<filename> ...]"
    exit 1
fi

# do the work
for file in $*
do
    :> $file
done

