npx knex migrate:latest --env dev_user
npx knex migrate:latest --env dev_forum
npx knex migrate:latest --env dev_uni

# Define seed completion indicator files
USER_SEED_FILE="./seeded_dev_user"
FORUM_SEED_FILE="./seeded_dev_forum"
UNI_SEED_FILE="./seeded_dev_uni"

# Check and run for dev_user environment
if [ ! -f "$USER_SEED_FILE" ]; then
  echo "Seeding users"
  npx knex seed:run --env dev_user && touch "$USER_SEED_FILE"
else
  echo "Seeds for dev_user environment already run."
fi

# Check and run for dev_forum environment
if [ ! -f "$FORUM_SEED_FILE" ]; then
  echo "Seeding forum"
  npx knex seed:run --env dev_forum && touch "$FORUM_SEED_FILE"
else
  echo "Seeds for dev_forum environment already run."
fi

# Check and run for dev_uni environment
if [ ! -f "$UNI_SEED_FILE" ]; then
  echo "Seeding universities"
  npx knex seed:run --env dev_uni && touch "$UNI_SEED_FILE"
else
  echo "Seeds for dev_uni environment already run."
fi