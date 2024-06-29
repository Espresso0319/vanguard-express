
#!/bin/bash
#
# start.sh
#
# Starts the vanguard server, usually used on local dev machine.

. ./.envrc

# Make sure the application root path is set
export APP_ROOT_PATH=$(pwd)/app

# Make sure all debug logging is enabled
export DEBUG=${DEBUG-vg:*}

# Force the NODE_ENV to be development
export NODE_ENV=${NODE_ENV-development}

# Run the application using nodemon, also debounce watch
nodemon --watch app --delay 1 ./app/web.js
