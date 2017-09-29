![Build Status](https://travis-ci.org/nkjm/apiai-promisified.svg?branch=master)

# 概要

api.aiのSDKをPromise対応させたパッケージ。

# インストール

```
$ npm install apiai-promisified
```

# 利用方法

```
const apiai = require('apiai-promisified');

const nlp = new apiai(promise.env.APIAI_CLIENT_ACCESS_TOKEN, {language: "ja"});

nlp.textRequest("ピザを注文したいのですが", "my_session_id").then(
    (response) => {
        console.log(`The action is ${response.result.action}`);
    }
);
```

# 制限

現在対応しているメソッドはtextRequest()のみ。
