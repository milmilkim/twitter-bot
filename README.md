# 서점 신간 알림 트위터봇

- server: node.js, express
- DB: mongodb
- odm: mongoose
- deploy: heroku

axios와 cheerio로 스크랩한 데이터를 db에 저장하고,
twitter api와 oauth 1.0을 활용하여 이미지를 업로드하고 트윗을 작성한다.
heroku의 `Scheduler` add-on으로 매일 post.js를 실행 시켜 자동으로 트윗한다.
