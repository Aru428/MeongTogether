const http = require("http");
const express = require("express");
const session = require("express-session");
const app = express();
const server = http.createServer(app);
const PORT = 8000;
const cors = require("cors");
app.use(cors({ origin: true, credentials: true })); //모든 접근 허용

const connectSocket = require("./socket");
connectSocket(server);

app.use("/static", express.static("static"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "secret key", // 비밀키를 설정합니다.
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 60 * 1000, // 세션 유지 시간을 한 시간으로 설정합니다.
    },
  })
);

// 미들웨어를 사용하여 모든 뷰에 로그인 상태(세션)를 전달
// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isAuthenticated;
//   res.locals.user = req.session.user;
//   console.log(res.locals.user);
//   next();
// });

const userRouter = require("./routes/user");
app.use("/user", userRouter);

const boardRouter = require("./routes/board");
app.use("/board", boardRouter);

const commentRouter = require("./routes/comment");
app.use("/comment", commentRouter);

const chatRouter = require("./routes/chat");
app.use("/chat", chatRouter);

const communityRouter = require("./routes/community");
app.use("/community", communityRouter);

const dogRouter = require("./routes/dog");
app.use("/dog", dogRouter);

server.listen(PORT, function () {
  console.log(`Sever Open: ${PORT}`);
});
