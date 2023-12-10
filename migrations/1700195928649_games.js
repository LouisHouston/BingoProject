/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("games", {
    id: "id",
    game_over:{
      type: "integer",
      notNull: true,
    },
    game_socket_id: {
      type: "varchar",
      notNull: true,
    },
    user_ids: {
      type: "integer[]",
    },
    user_x_card_ids: {
      type: "integer[]",
    },
    user_y_card_id: {
      type: "integer",
    },
    drawn_numbers_id: {
      type: "integer",
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("games");
};
