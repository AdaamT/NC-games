If this repo is pulled, you will need to add the envirnoment varibles in manually.

This can be done by creating:
.env.test - inside the file: PGDATABASE=nc_games_test
.env.development - inside the file: PGDATABASE=nc_games

This will ensure you are connecting to the correct database and be done via the script in the JSON file:
"setup-dbs": "psql -f ./db/setup.sql"

Running this in the terminal will set everything up.
