import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const OAuth = `OAuth oauth_consumer_key=${process.env.TWITTER_API_KEY},oauth_token=${process.env.TWITTER_ACCESS_TOKEN},oauth_signature_method="HMAC-SHA1",oauth_timestamp="1657553860",oauth_nonce=${process.env.OAUTH_NONCE},oauth_version="1.0",oauth_signature=${process.env.TWITTER_SIGNITURE}`;
const now = new Date();
/* 연동 테스트 */
try {
  const result = await axios.post(
    'https://api.twitter.com/2/tweets',
    {
      text: 'Hello world!' + now,
    },
    {
      headers: {
        Authorization: OAuth,
      },
    }
  );
} catch (err) {
  console.error(err);
}
