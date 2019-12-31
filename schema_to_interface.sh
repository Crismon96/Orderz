#!/bin/bash

SOURCEDIR="./sharedModules/JSONschemas"
TARGETDIR="./sharedModules/schemaInterfaces"

rm -f "$TARGETDIR/*schema.d.ts"

for schema in $SOURCEDIR/*schema.json;
do
	echo "INPUT: $schema"
	filename=`basename "$schema"`
	echo "OUTPT: $TARGETDIR/${filename%.json}.d.ts"
        npx json2ts --cwd "$SOURCEDIR" --input "$schema" --output "$TARGETDIR/${filename%.json}.d.ts"
done

