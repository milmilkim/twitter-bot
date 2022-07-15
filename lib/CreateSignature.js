import dotenv from 'dotenv';
import { v4 } from 'uuid';
import crypto from 'crypto';

dotenv.config();

/**
 *
 * {
 *      oauthToken,
 *      oauthSecret,
 * }
 */

const createSignature = (twitterUrl = 'https://api.twitter.com/2/tweets', method = 'POST', options) => {
  const oauth_timestamp = Math.floor(+new Date() / 1000);
  const oauth_nonce = v4();
  const oauth_consumer_key = process.env.TWITTER_API_KEY;
  const oauth_consumer_secret = process.env.TWITTER_API_SECRET_KEY;

  //계정에 따라 다르게 설정 가능
  const oauth_token = options?.oauthToken || process.env.TWITTER_ACCESS_TOKEN;
  const oauth_secret = options?.oauthSecret || process.env.TWITTER_ACEESS_TOKEN_SECRET;

  const parameters = {
    oauth_consumer_key,
    oauth_nonce,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp,
    oauth_version: '1.0',
    oauth_token: oauth_token,
  };

  //요청에 필요한 파라미터를 모두 모은다

  function encodeValue(value) {
    const q_encoded = encodeURIComponent(value).replace(/[_!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
    return q_encoded;
  }

  let ordered = {};
  Object.keys(parameters)
    .sort()
    .forEach(function (key) {
      ordered[key] = parameters[key];
    });
  //인코딩된 key 알파벳 순으로 정렬한다

  let encodedParameters = '';

  for (let key in ordered) {
    const encodedValue = encodeValue(ordered[key]);
    const encodedKey = encodeURIComponent(key);
    if (encodedParameters === '') {
      encodedParameters += `${encodedKey}=${encodedValue}`;
    } else {
      encodedParameters += `&${encodedKey}=${encodedValue}`;
    }
  }
  //키와 밸류를 퍼센트 인코딩

  const encodedUrl = encodeURIComponent(twitterUrl);
  encodedParameters = encodeURIComponent(encodedParameters);

  //base string으로 합치기

  const signature_base_string = `${method}&${encodedUrl}&${encodedParameters}`;

  //consumer secret과 oauth scret을 &로 연결
  const signing_key = `${encodeURIComponent(oauth_consumer_secret)}&${encodeURIComponent(oauth_secret)}`;

  //서명 키로 base string을 sha1로 암호화
  const oauth_signature = crypto.createHmac('sha1', signing_key).update(signature_base_string).digest('base64');

  const encoded_oauth_signature = encodeURIComponent(oauth_signature);

  const header = `OAuth oauth_consumer_key="${parameters.oauth_consumer_key}",oauth_token="${parameters.oauth_token}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${parameters.oauth_timestamp}",oauth_nonce="${parameters.oauth_nonce}",oauth_version="1.0",oauth_signature="${encoded_oauth_signature}"`;

  return header;
};

export default createSignature;
