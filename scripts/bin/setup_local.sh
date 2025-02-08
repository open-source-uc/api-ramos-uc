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
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-1.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-2.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-3.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-4.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-5.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-6.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-7.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-8.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-9.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-10.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-11.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-12.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-13.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-14.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-15.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-16.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-17.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-18.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-19.sql
npx wrangler d1 execute ramos-uc --local --file=../sql/2025-1/2025-20.sql
