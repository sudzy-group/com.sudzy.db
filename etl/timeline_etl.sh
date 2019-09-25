#!/bin/bash

usage()
{
    echo "usage: timeline_etl -s ... -m ... -u ... -p ... -c ... | [-h]]"
}

do_etl() 
{
  lib/tools/timeline_etl.js -p "$couchdb/${store}_timeline" -P $store -U $store -h "$mysql" -u $user -w $pass -d etl -s $store
}

store=
mysql=
user=
pass=
couchdb=
filePath=

while [ "$1" != "" ]; do
    case $1 in
        -s | --store )          shift
                                store=$1
                                ;;
        -m | --mysql )          shift
                                mysql=$1
                                ;;
        -u | --user )           shift
                                user=$1
                                ;;
        -p | --pass )           shift
                                pass=$1
                                ;;
        -c | --couchdb )        shift
                                couchdb=$1
                                ;;
        -f | --filePath )       shift
                                filePath=$1
                                ;;
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

lib/tools/checkETLStatus.js -p $couchdb -s $store -f $filePath -a '_timeline'
updateAvailable=$?

if [ $updateAvailable -eq 1 ]
    then
    do_etl;
fi