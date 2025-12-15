import Pushsafer from "pushsafer-notifications";

const push = new Pushsafer({
  k: process.env.PUSHSAFER_PRIVATE_KEY,
});

export default function sendPush(message, title = "Thông báo") {
    return new Promise((resolve, reject) => {
      push.send(
        {
          m: message,
          t: title,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
}
  
