#!/bin/bash

usage()
{
    echo "usage: etl -s ... -m ... -u ... -p ... -c ... | [-h]]"
}

do_etl() 
{
  sed s/\{\{store_id\}\}/$store/g etl/tables.sql > etl/tables_$store.sql
  sed s/\{\{store_id\}\}/$store/g etl/summary_tables.sql > etl/summary_tables_$store.sql
  mysql -h $mysql -D etl -u $user -p$pass < etl/tables_$store.sql
  lib/tools/etl.js -p "$couchdb/$store" -P $store -U $store -h "$mysql" -u $user -w $pass -d etl -s $store
  mysql -h $mysql -D etl -u $user -p$pass < etl/summary_tables_$store.sql
}

store=
mysql=
user=
pass=
couchdb=

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
        -h | --help )           usage
                                exit
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done

do_etl

