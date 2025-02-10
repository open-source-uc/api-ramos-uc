npx wrangler d1 execute ramos-uc --local --file=../sql/drop_tables.sql
echo Tablas dropeadas
npx wrangler d1 execute ramos-uc --local --file=../sql/create_tables.sql
echo Tablas creadas
npx wrangler d1 execute ramos-uc --local --file=../sql/insert_defaults.sql
echo Datos default insertados
npx wrangler d1 execute ramos-uc --local --file=../sql/triggers.sql
echo "Triggers creados"
npx wrangler d1 execute ramos-uc --local --file=../sql/index.sql
echo "Index creados"
echo Insertando cursos
for file in ../sql/2025-1/*.sql; do
    echo "Ejecutando $file..."
    npx wrangler d1 execute ramos-uc --local --file="$file"
done
