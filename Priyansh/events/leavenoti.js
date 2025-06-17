module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Modified by Amir",
  description: "Notify when member leaves or is kicked",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const fs = require("fs");
  const axios = require("axios");

  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  function reply(data) {
    api.sendMessage(data, event.threadID, event.messageID);
  }

  const { threadName, participantIDs } = await api.getThreadInfo(event.threadID);
  const userID = event.logMessageData.leftParticipantFbId;
  const userInfo = await api.getUserInfo(userID);
  const userName = userInfo[userID].name;
  const totalMembers = participantIDs.length;
  const isKicked = event.author !== userID;

  const pathh = __dirname + `/cache/bye.png`;

  // Random background selection
  const backgrounds = [
    "https://i.imgur.com/oFLLEW3.jpeg",
    "https://i.imgur.com/qAgUPo7.jpeg",
    "https://i.imgur.com/PPYFSyW.jpeg",
    "https://i.imgur.com/NLaFNEM.jpeg",
    "https://i.imgur.com/W1O6KIQ.jpeg"
  ];
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  // Profile picture URL
  const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

  // New Goodbye API
  const apiURL = `https://kaiz-apis.gleeze.com/api/goodbye?pp=${encodeURIComponent(avatarURL)}&nama=${encodeURIComponent(userName)}&bg=${encodeURIComponent(randomBg)}&member=${totalMembers}&apikey=3873fc7b-0e7e-4b6b-94b7-5be99869552e`;

  try {
    const response = await axios.get(apiURL, { responseType: "arraybuffer" });
    fs.writeFileSync(pathh, Buffer.from(response.data, "utf-8"));

    const type = isKicked
      ? "✰ 𝐊𝐚 𝐌𝐨𝐘𝐞 𝐌𝐨𝐘𝐞 𝐇𝐎𝐨 𝐆𝐘𝐚\n               ┑(￣▽￣)┍"
      : "✰ 𝐅𝐚𝐑𝐚𝐑 ┑ಢ‸ಢ ";

    const message = {
      body: `     \n   ‿︵‿︵ʚ˚̣̣̣͙ɞ・❉・ ʚ˚̣̣̣͙ɞ‿︵‿︵\n─━──❝ 𝐍𝐘𝐜 𝐌𝐨𝐕𝐞 ❞──━─\n ●▬▬▬▬▬▬▬▬▬▬▬▬●\n\n              ➥ ${userName} ${type}\n➥ 𝐑𝐄𝐌𝐀𝐈𝐍𝐈𝐆 𝐌𝐄𝐌𝐁𝐄𝐑𝐒R: ${totalMembers} \n\n●▬▬▬▬▬▬▬▬▬▬▬▬●`,
      attachment: fs.createReadStream(pathh)
    };

    reply(message);
  } catch (error) {
    console.error("❌ Error in leaveNoti:", error);
    reply(`❌ Error while generating goodbye image for ${userName}.`);
  }
};
    
