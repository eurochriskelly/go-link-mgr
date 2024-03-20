#!/bin/bash
#
# If user passes --uninstall switch, remove the installed files

if [ "$1" = "--uninstall" ]; then
    if [ -f $HOME/go/bin/linkman ]; then
        echo "Removing files..."
        rm $HOME/go/bin/linkman
    fi
else
    echo "Installing files..."
    npm link -g .
fi
