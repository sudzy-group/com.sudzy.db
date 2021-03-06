#!/bin/bash

usage()
{
    echo "usage: factory_etl -s ... -m ... -u ... -p ... -c ... | [-h]]"
}

do_etl() 
{
  sed s/\{\{store_id\}\}/$store/g etl/factory_tables.sql > etl/factory_tables_$store.sql
  sed s/\{\{store_id\}\}/$store/g etl/factory_summary_tables.sql > etl/factory_summary_tables_$store.sql
  mysql -h $mysql -D etl -u $user -p$pass < etl/factory_tables_$store.sql
  lib/tools/factory_etl.js -p "$couchdb/${store}_factory" -P $store -U $store -h "$mysql" -u $user -w $pass -d etl -s $store
  mysql -h $mysql -D etl -u $user -p$pass < etl/factory_summary_tables_$store.sql
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

lib/tools/checkETLStatus.js -p $couchdb -s $store -f $filePath -a '_factory'
updateAvailable=$?

if [ $updateAvailable -eq 1 ]
    then
    do_etl;
fi