const db = require("../knex");
const { authenticateToken } = require("../modules/jwt_utils.js");

/**
 * @swagger
 * tags:
 *   -  name: users
 *      description: Operations related to users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get user information
 *     tags:
 *          - users
 *     description: Retrieve user information based on the user's role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *       404:
 *         description: User information not found or database query failed.
 *   put:
 *     summary: Update user information
 *     tags:
 *          - users
 *     description: Update user information based on the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image_filename:
 *                 type: string
 *               flavor_text:
 *                 type: string
 *               year_on_exchange:
 *                 type: integer
 *               exchange_duration:
 *                 type: integer
 *               university_name:
 *                 type: string
 *               handle:
 *                 type: string
 *               exchange_name:
 *                 type: string
 *               major:
 *                 type: string
 *               aspire:
 *                 type: string
 *     responses:
 *       200:
 *         description: User information updated successfully.
 *       404:
 *         description: Update failed.
 *   post:
 *     summary: Create new user
 *     tags:
 *          - users
 *     description: Create a new user and insert into the database.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image_filename:
 *                 type: string
 *               flavor_text:
 *                 type: string
 *               year_on_exchange:
 *                 type: integer
 *               exchange_duration:
 *                 type: integer
 *               handle:
 *                 type: string
 *               exchange_name:
 *                 type: string
 *               major:
 *                 type: string
 *               aspire:
 *                 type: string
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: New user created successfully.
 *       404:
 *         description: Update failed.
 * /users/interests:
 *   get:
 *     summary: Get user interests
 *     tags:
 *          - users
 *     description: Retrieve user interests.
 *     responses:
 *       200:
 *         description: User interests retrieved successfully.
 *       404:
 *         description: Interest database query failed.
 * /users/interests/{user_email}:
 *   get:
 *     summary: Get user interests by email
 *     tags:
 *          - users
 *     description: Retrieve user interests by email.
 *     parameters:
 *       - in: path
 *         name: user_email
 *         required: true
 *         description: Email of the user to retrieve interests for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User interests retrieved successfully.
 *       404:
 *         description: Failed to fetch user interests.
 * /users/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags:
 *          - users
 *     description: Retrieve user information by email.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *       404:
 *         description: User information not found or database query failed.
 * /users/university/{university}:
 *   get:
 *     summary: Get users by university
 *     tags:
 *          - users
 *     description: Retrieve users by university.
 *     parameters:
 *       - in: path
 *         name: university
 *         required: true
 *         description: Name of the university to retrieve users for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       404:
 *         description: User database query failed.
 */

module.exports = (app) => {
  app
    .route("/users")
    .get(authenticateToken, (req, res) => {
      if (req.jwt_object.is_admin) {
        db.select()
          .from("user")
          .then((users) => {
            res.json(users);
          })
          .catch((err) => {
            res.status(404).json({
              success: false,
              message: err.message,
              stack: err.stack,
            });
          });
      } else {
        db.select()
          .from("user")
          .where("email", req.jwt_object.email)
          .then((user) => {
            if (user.length == 0)
              throw new Error(`User ${req.jwt_object.email} not found`);
            res.json(user[0]);
          })
          .catch((err) => {
            res.status(404).json({
              success: false,
              message: err.message,
              stack: err.stack,
            });
          });
      }
    })
    .put(authenticateToken, (req, res) => {
      // const { interests, ...userData } = req.body

      db("user")
        .where("email", req.jwt_object.email)
        .update({
          ...req.body,
          updated: db.fn.now(),
        })
        .returning("*")
        .then(([user_data]) => {
          res.status(200).json({
            user_data,
          });
        })
        .catch((err) =>
          res.status(404).json({
            success: false,
            message: "update failed",
            stack: err.stack,
          })
        );
    })
    .post(authenticateToken, async (req, res) => {
      const { interests, ...userData } = req.body;

      db.transaction(async (trx) => {
        try {
          // Insert user
          const [user_data] = await trx("user")
            .insert({
              email: req.jwt_object.email,
              ...userData,
              updated: trx.fn.now(),
            })
            .returning("*");

          if (interests.length != 0) {
            await trx.raw(
              `
                            INSERT INTO interest (interest)
                            SELECT unnest(?::text[]) 
                            ON CONFLICT (interest) DO NOTHING
                        `,
              [interests]
            );

            // Retrieve IDs for all interests
            const interestIds = await trx("interest")
              .select("id")
              .whereIn("interest", interests);

            // Prepare user_interest insertions
            const userInterestPairs = interestIds.map(({ id }) => ({
              interest_id: id,
              user_email: user_data.email,
            }));

            // Bulk insert into user_interest, assuming no duplicates
            await trx("user_interest").insert(userInterestPairs);
          }

          await trx.commit();
          res.status(200).json({
            user_data,
          });
        } catch (err) {
          await trx.rollback();
          res.status(404).json({
            success: false,
            message: "update failed",
            stack: err.stack,
          });
        }
      });
    });

  app.route("/users/interests").get((req, res) => {
    db("interest")
      .select()
      .then((result) => {
        res.json(result);
      })
      .catch((err) =>
        res.status(404).json({
          success: false,
          message: "interest database query failed",
          stack: err.stack,
        })
      );
  });

  app.route("/users/interests/:user_email").get((req, res) => {
    const { user_email } = req.params;

    db("user_interest")
      .where("user_email", user_email)
      .join("interest", "user_interest.interest_id", "=", "interest.id")
      .select("interest.interest")
      .then((interests) => {
        res.json({
          interests: interests.map((interest) => interest.interest),
        });
      })
      .catch((err) =>
        res.status(404).json({
          success: false,
          message: "Failed to fetch user interests",
          stack: err.stack,
        })
      );
  });

  app.route("/users/search/:searchTerm").get((req, res) => {
    const search = req.params.searchTerm;
    let searchArr = search.split(" ");

    db.select()
      .from("user")
      .where((builder) => {
        for (let searchTerm of searchArr) {
          builder.orWhere("email", "ilike", `%${searchTerm}%`);
        }
      })
      .then((data) => {
        res.json(data);
      })
      .catch((err) =>
        res.status(404).json({
          success: false,
          message: "universities not found",
          stack: err.stack,
        })
      );
  });

  app.route("/users/email/:email").get((req, res) => {
    const { email } = req.params;

    let reqFields = req.query.fields;

    if (!Array.isArray(reqFields)) {
      reqFields = [reqFields];
    }

    db("user")
      .select(...reqFields)
      .where("email", email)
      .first()
      .then((results) => {
        res.set("Cache-Control", "public, max-age=86400");
        res.json(results);
      })
      .catch((err) =>
        res.status(404).json({
          success: false,
          message: "user database query failed",
          stack: err.stack,
        })
      );

    return;
  });

  app.route("/users/university/:university").get((req, res) => {
    const { university } = req.params;

    db("user")
      .select()
      .where("university_name", university)
      .then((results) => {
        res.json(results);
      })
      .catch((err) =>
        res.status(404).json({
          success: false,
          message: "user database query failed",
          stack: err.stack,
        })
      );
  });
};

// Orphaned route?
// app.route('/users/update')
//     .post((req, res) => {
//         const {user_email} = req.body
//     })
