/* eslint-disable camelcase */

/**
 * @param {import("node-pg-migrate/dist/types").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: "id",
    email: {
      type: "varchar(256)",
      notNull: true,
      unique: true,
    },
    password: {
      type: "char(60)",
      notNull: true,
    },
    username: {
      type: "varchar(256)",
      notNull: true,
      unique: false,
    },
    gamesplayed: {
      type: "INT",
      notNull: true,
      default: 0,
    },
    gameswon: {
      type: "INT",
      notNull: true,
      default: 0,
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
  pgm.dropTable("users");
};
