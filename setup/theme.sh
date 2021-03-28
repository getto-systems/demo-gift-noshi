#!/bin/sh

if [ -z "$APP_ROOT" ]; then
    APP_ROOT=.
fi

version=2.28.2
find $APP_ROOT/public/ -name '*.html' | xargs sed -i "s|[^/]*/getto.css|${version}/getto.css|"
find $APP_ROOT/storybook/ -name '*.html' | xargs sed -i "s|[^/]*/getto.css|${version}/getto.css|"
