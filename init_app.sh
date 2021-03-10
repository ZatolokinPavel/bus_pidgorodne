#!/bin/sh

### BEGIN INIT INFO
# Provides:          bus_pidgorodne
# Required-Start:    $local_fs $remote_fs $network $syslog $named
# Required-Stop:     $local_fs $remote_fs $network $syslog $named
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the bus_pidgorodne
# Description:       starts bus_pidgorodne app for site bus_pidgorodne_dp_ua using relx release
### END INIT INFO

PROJECT_DIR=/opt/bus_pidgorodne

NAME=bus_pidgorodne
DESC=bus_pidgorodne

export HOME=${PROJECT_DIR}
export RUN_ERL_LOG_ALIVE_MINUTES=60

echo "Send command to app 'bus_pidgorodne':"
echo "$PROJECT_DIR make $1"
echo ""

case "$1" in
    start)
        cd ${PROJECT_DIR} && make start
        nginx -s reload
        ;;
    stop)
        cd ${PROJECT_DIR} && make stop
        ;;
    release)
        cd ${PROJECT_DIR} && make stop
        cd ${PROJECT_DIR} && git pull
        cd ${PROJECT_DIR} && make rel
        cd ${PROJECT_DIR} && make start
        nginx -s reload
        ;;
    attach)
        cd ${PROJECT_DIR} && make attach
        ;;
    *)
        ;;
esac

exit 0
