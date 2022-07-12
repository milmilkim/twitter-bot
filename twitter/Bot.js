import createSignature from '../lib/CreateSignature.js';
import axios from 'axios';
import FormData from 'form-data';

class Bot {
  constructor() {
    this._oauthToken = null;
    this._oauthSecret = null;
    this._header = null;
  }

  set oauthToken(value) {
    this._oauthToken = value;
  }

  get oauthToken() {
    return this._oauthToken;
  }

  set oauthSecret(value) {
    this._oauthSecret = value;
  }

  get oauthSecret() {
    return this._oauthSecret;
  }

  init(value) {
    this.oauthToken = value['oauthToken'];
    this.oauthSecret = value['oauthSecret'];
  }

  async send(url, header, method = 'post', data, contentType = 'application/json') {
    try {
      const res = await axios({
        url,
        method,
        data,
        headers: {
          Authorization: header,
          'Content-Type': contentType,
        },
      });

      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async addTweet(data) {
    const url = 'https://api.twitter.com/2/tweets';
    const header = createSignature(url, 'POST', {
      oauthToken: this.oauthToken,
      oauthSecret: this.oauthSecret,
    });
    return await this.send(url, header, 'post', data);
  }

  async uploadMedia(data) {
    /**
     * data: base 64 이미지 문자열
     * data:image/png;base64 제외하고 뒷부분
     * */

    const frm = new FormData();

    frm.append('media_data', data);

    const url = 'https://upload.twitter.com/1.1/media/upload.json';
    const header = createSignature(url, 'POST', {
      oauthToken: this.oauthToken,
      oauthSecret: this.oauthSecret,
    });
    return this.send(url, header, 'POST', frm, 'multipart/form-data');
  }
}

export default Bot;
