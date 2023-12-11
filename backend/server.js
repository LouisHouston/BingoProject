const path = require("path");
const { createServer } = require("http");

const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const { Server } = require("socket.io");
var uuid = require('node-uuid');

const {
  viewSessionData,
  sessionLocals,
  isAuthenticated,
} = require("./middleware/");

const app = express();
const httpServer = createServer(app);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "static")));

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV === "development") {
  require("dotenv").config();

  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "static"));
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh(`/`);
    }, 100);
  });

  app.use(connectLiveReload());
}


const sessionMiddleware = session({
  genid: () => {
    return uuid.v4();
  },
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    conString: process.env.DATABASE_URL,
  }),

  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV !== "development" },
 
});


app.use(sessionMiddleware);


if (process.env.NODE_ENV === "development") {
  app.use(viewSessionData);
}

app.use(sessionLocals);

  

const io = new Server(httpServer);
app.set("io", io);
io.engine.use(sessionMiddleware);



io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (messageData) => {
        const content = messageData.content;
        const sender = messageData.sender;
        const timestamp = messageData.timestamp;
        const gamecode = messageData.gamecode;
        const db = configureDatabase();
        console.log(messageData);
        db.connect((err) => {
            if (err) {
                console.error('db connection error:', err);
            } else {
                console.log('Connected to the database');
                db.query("INSERT INTO gamechat (user_id, game_id, message, time_sent) VALUES ($1, $2, $3 , $4)", [sender, gamecode, content, timestamp], (error, result) => {
                    if (error) {
                        console.error("frror saving message to the db:", error);
                    } else {
                        console.log('message inserted good');
                        io.emit("message", messageData);
                    }
                    db.end();
                });
            }
        });
    });


    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});