#!/bin/bash

# Preguntar si el usuario quiere modo local o remoto
echo "Seleccione el modo de ejecución:"
echo "1) Local"
echo "2) Remoto"
read -p "Opción (1/2): " mode

# Definir el flag según la opción elegida
if [ "$mode" == "1" ]; then
    FLAG="--local"
elif [ "$mode" == "2" ]; then
    FLAG="--remote"
else
    echo "Opción inválida. Saliendo."
    exit 1
fi

npx wrangler d1 execute ramos-uc $FLAG --file=../sql/drop_tables.sql
echo "Tablas dropeadas"

npx wrangler d1 execute ramos-uc $FLAG --file=../sql/create_tables.sql
echo "Tablas creadas"

npx wrangler d1 execute ramos-uc $FLAG --file=../sql/insert_defaults.sql
echo "Datos default insertados"

npx wrangler d1 execute ramos-uc $FLAG --file=../sql/triggers.sql
echo "Triggers creados"

npx wrangler d1 execute ramos-uc $FLAG --file=../sql/index.sql
echo "Index creados"

echo "Insertando cursos"
for file in ../sql/2025-1/*.sql; do
    echo "Ejecutando $file..."
    npx wrangler d1 execute ramos-uc $FLAG --file="$file"
done