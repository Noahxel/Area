const axios = require("axios");

exports.generateDescription = async function (area) {
    const areaString = JSON.stringify(area, null, 2);
    const prompt = `i need you to generate a short description for area creation with little bit imagination, like for example if the user creates this area:
    {
        "_id": "",
        "trigger": {
          "service": "dateTime",
          "name": "every_day_at",
          "parameters": [
            {
              "name": "target_hour",
              "input": "18"
            },
            {
              "name": "target_minute",
              "input": "15"
            }
          ]
        },
        "isActive": true,
        "actions": [
          {
            "service": "spotify",
            "name": "follow_playlist",
            "parameters": [
              {
                "name": "playlist_id",
                "input": "1FGHap1L2xUZ057TnrmxIt"
              }
            ]
          }
        ]
      }
    Follow a Spotify playlist every days at 18h15 late in the afternoon
    or
    {
        "_id": "",
        "trigger": {
          "service": "spotify",
          "name": "new_recently_played_track",
          "parameters": []
        },
        "isActive": true,
        "actions": [
          {
            "service": "gmail",
            "name": "send_email",
            "parameters": [
              {
                "name": "to_address",
                "input": "patteinh@gmail.com lola@gmail.com"
              },
              {
                "name": "cc_address",
                "input": "patteinh@gmail.com"
              },
              {
                "name": "bcc_address",
                "input": "patteinh@gmail.com"
              },
              {
                "name": "subject",
                "input": "IFTTT"
              },
              {
                "name": "body",
                "input": "new spotify track was listen"
              },
              {
                "name": "attachment_url",
                "input": "https://fr.wiktionary.org/wiki/aa"
              }
            ]
          }
        ]
      }
    Send an email to patteinh@gmail.com and lola@gmail.com when a new spotify track was listen.
    If u see words under <> just precise that this is link to the trigger.
    140 letters max for teh description !.
    now you need to provide description for:
    ${areaString}`;
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "text-davinci-002",
                prompt: prompt,
                max_tokens: 50,
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ???`,
                },
            }
        );
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error("Error generating description:", error);
        throw error;
    }
};
