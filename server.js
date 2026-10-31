const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// 배포할 때 환경변수 ADMIN_PASSWORD를 설정하세요.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1234";

const teams = [
  "당하 FC",
  "불로 2015 유나이티드",
  "대타 FC",
  "백야 FC",
  "리현 R 랜드",
  "홍댕무 유나이티드",
  "컬러 클로버"
];

let results = [];

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "change-this-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  }
}));

app.use(express.static(path.join(__dirname, "public")));

function adminOnly(req, res, next) {
  if (!req.session.admin) {
    return res.status(403).json({ error: "관리자만 사용할 수 있습니다." });
  }
  next();
}

// 로그인
app.post("/api/login", (req, res) => {
  const { password } = req.body;

  if (typeof password !== "string" || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: "비밀번호가 틀렸습니다."
    });
  }

  req.session.admin = true;
  res.json({ success: true });
});

// 로그아웃
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// 로그인 상태
app.get("/api/me", (req, res) => {
  res.json({ admin: !!req.session.admin });
});

// 경기 결과 전체 조회
app.get("/api/results", (req, res) => {
  res.json(results);
});

// 관리자: 경기 결과 등록
app.post("/api/results", adminOnly, (req, res) => {
  const { round, home, away, homeScore, awayScore, date } = req.body;

  if (
    !Number.isInteger(round) ||
    !teams.includes(home) ||
    !teams.includes(away) ||
    home === away ||
    !Number.isInteger(homeScore) ||
    !Number.isInteger(awayScore) ||
    homeScore < 0 ||
    awayScore < 0
  ) {
    return res.status(400).json({
      error: "경기 결과가 올바르지 않습니다."
    });
  }

  const match = {
    round,
    home,
    away,
    homeScore,
    awayScore,
    date: typeof date === "string" ? date : ""
  };

  const index = results.findIndex(r =>
    r.round === round &&
    r.home === home &&
    r.away === away
  );

  if (index >= 0) {
    results[index] = match;
  } else {
    results.push(match);
  }

  res.json({
    success: true,
    result: match
  });
});

// 관리자: 결과 삭제
app.delete("/api/results/:round/:home/:away", adminOnly, (req, res) => {
  const round = Number(req.params.round);
  const home = req.params.home;
  const away = req.params.away;

  results = results.filter(r =>
    !(r.round === round && r.home === home && r.away === away)
  );

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`UNIBERS 서버 실행: http://localhost:${PORT}`);
});
