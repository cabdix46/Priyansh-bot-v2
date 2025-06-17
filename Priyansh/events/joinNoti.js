module.exports.config = {
  name: "joinnnn",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "Amir",
  description: "Welcome image + bot connected message",
  dependencies: {
    "fs-extra": "",
    "request": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const fs = global.nodemodule["fs-extra"];
  const request = require("request");
  const { threadID, logMessageData } = event;

  // Bot added to group
  if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`》 ${global.config.PREFIX} 《 ❃ ➠ ${global.config.BOTNAME || "Bot"}`, threadID, api.getCurrentUserID());
    return api.sendMessage("≪══════◄••❀••►══════≫\n\n𝗖𝗼𝗻𝗻𝗲𝗰𝘁𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!
𝗧𝗵𝗮𝗻𝗸 𝗬𝗼𝘂 𝗙𝗼𝗿 𝗖𝗵𝗼𝗼𝘀𝗶𝗻𝗴\n\n ┏━━━━ 🖤 ━━━━┓\n  \n ┗━━━    🖤 ━━━━┛ \n\n 𝗕𝗼𝗧, 𝗛𝗮𝘃𝗲 𝗙𝘂𝗻 𝗨𝘀𝗶𝗻𝗴 𝗶𝘁 ❀\n\n ☆𝗕𝗼𝗧 𝗢𝘄𝗻𝗲𝗿☆ \n\n ╔════•|🖤|•════╗           ✦❥⋆⃝𝗝𝗢𝗥𝗗𝗔𝗡 ✦\n╚════•|🖤|•════╝
\n\n ≪══════◄••❀••►══════≫", threadID, () => {
      setTimeout(() => {
        api.sendMessage({ sticker: 568554150208913 }, threadID);
      }, 200);
    });
  }

  // Background options
  const backgrounds = [
    "https://i.imgur.com/oFLLEW3.jpeg",
    "https://i.imgur.com/qAgUPo7.jpeg",
    "https://i.imgur.com/PPYFSyW.jpeg",
    "https://i.imgur.com/NLaFNEM.jpeg",
    "https://i.imgur.com/W1O6KIQ.jpeg"
  ];

  try {
    const addedParticipants = logMessageData.addedParticipants;
    const threadInfo = await api.getThreadInfo(threadID);
    const threadName = threadInfo.threadName;
    const memberCount = threadInfo.participantIDs.length;

    for (let participant of addedParticipants) {
      const userID = participant.userFbId;
      if (userID == api.getCurrentUserID()) continue;

      const userInfo = await api.getUserInfo(userID);
      const userName = userInfo[userID].name;

      const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // Select random background
      const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      // Kaiz Welcome API
      const imageUrl = `https://kaiz-apis.gleeze.com/api/welcome?username=${encodeURIComponent(userName)}&avatarUrl=${encodeURIComponent(avatarUrl)}&groupname=${encodeURIComponent(threadName)}&bg=${encodeURIComponent(randomBg)}&memberCount=${memberCount}&apikey=3873fc7b-0e7e-4b6b-94b7-5be99869552e`;

      const filePath = __dirname + `/cache/welcome_${userID}.jpg`;

      // Download and send image
      request(imageUrl)
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => {
          api.sendMessage({
            body: `  ‿︵‿︵ʚ˚̣̣̣͙ɞ・❉・ ʚ˚̣̣̣͙ɞ‿︵‿︵\n ─━──❝ 𝗪𝗘𝗟𝗟 𝗖𝗢𝗠𝗘 ❞──━─\n‎ ≪══════◄••❀••►══════≫\n\n ☆|| 𝐄𝐋𝐋𝐨𝐰 ${userName}! \n 𝐖𝐞𝐋𝐋 𝐂𝐨𝐌𝐞 𝐓𝐨 \n\n: ${threadName} \n 𝐀𝐩 𝐢𝐬 𝐆𝐫𝐨𝐮𝐩 𝐊𝐞 \n #${memberCount}\n 𝐓𝐡 𝐌𝐞𝐦𝐛𝐞𝐫 𝐇𝐨 𝐄𝐧𝐣𝐨𝐲 ✦ ʕ⁠っ⁠•⁠ᴥ⁠•⁠ʔ⁠っ \n\n≪══════◄••❀••►══════≫`,
            attachment: fs.createReadStream(filePath),
            mentions: [{ tag: userName, id: userID }]
          }, threadID, () => fs.unlinkSync(filePath));
        });
    }
  } catch (err) {
    console.error("JOIN EVENT ERROR:", err);
  }
};
  
