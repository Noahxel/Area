const { newSavedTrack, newSavedAlbum, newRecentlyPlayedTrack, newTrackAddedToPlaylist, followPlaylist, saveTrack, addToPlaylistById } = require("../area/spotifyArea");
const { everyDayAt, everyHourAt, everyDayOfTheWeekAt, everyMonthOnThe, everyYearOn } = require("../area/dateTimeArea");
const { anyNewCommit, anyNewIssue, newIssueAssignedToYou, newRepository, createIssue } = require("../area/githubArea");
const { streamGoingLiveForChannel, youFollowNewChannel, newFollowerOnYourChannel } = require("../area/twitchArea");
const { newLikedVideo, newVideoByChannel, newSubscription, likeVideo } = require("../area/youtubeArea");
const { newFileInFolder, newSharedFileLink, uploadFileFromURL } = require("../area/dropboxArea");
const { rainy_weather, sunny_weather, cloudy_weather, snow_weather, temperature_change } = require("../area/openWeatherArea");
const { sendEmail, sendEmailToSelf } = require("../area/gmailArea");

class Area {
    constructor(triggers, actions, color) {
        this.triggers = triggers;
        this.actions = actions;
        this.color = color;
    }
}

class Trigger {
    constructor(name, description, parameters, triggerFunction, ingredients) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.triggerFunction = triggerFunction;
        this.ingredients = ingredients;
    }
}

class Action {
    constructor(name, description, parameters, actionFunction) {
        this.name = name;
        this.description = description;
        this.parameters = parameters;
        this.actionFunction = actionFunction;
    }
}

const OPENWEATHER_TRIGGERS = [
    new Trigger(
        "sunny_weather",
        "Triggers when the current weather condition is sunshine",
        [{ name: "city", input: "City to monitor for sunshine", optional: false }],
        sunny_weather,
        [
            { name: "city", description: "City targeted" },
            { name: "description", description: "Description of weather" },
            { name: "temperature", description: "Current temperature" },
        ]
    ),
    new Trigger(
        "cloudy_weather",
        "Triggers when the current weather condition is clouds",
        [{ name: "city", input: "City to monitor for clouds", optional: false }],
        cloudy_weather,
        [
            { name: "city", description: "City targeted" },
            { name: "description", description: "Description of weather" },
            { name: "temperature", description: "Current temperature" },
        ]
    ),
    new Trigger(
        "rainy_weather",
        "Triggers when the current weather condition is rain",
        [{ name: "city", input: "City to monitor for rain", optional: false }],
        rainy_weather,
        [
            { name: "city", description: "City targeted" },
            { name: "description", description: "Description of weather" },
            { name: "temperature", description: "Current temperature" },
        ]
    ),
    new Trigger(
        "thunderstorm_weather",
        "Triggers when the current weather condition is thunderstorm",
        [{ name: "city", input: "City to monitor for snow", optional: false }],
        snow_weather,
        [
            { name: "city", description: "City targeted" },
            { name: "description", description: "Description of weather" },
            { name: "temperature", description: "Current temperature" },
        ]
    ),
    new Trigger(
        "snow_weather",
        "Triggers when the current weather condition is snow",
        [{ name: "city", input: "City to monitor for snow", optional: false }],
        snow_weather,
        [
            { name: "city", description: "City targeted" },
            { name: "description", description: "Description of weather" },
            { name: "temperature", description: "Current temperature" },
        ]
    ),
    new Trigger(
        "temperature_change",
        "Triggers when the temperature crosses a specified threshold",
        [
            { name: "city", input: "City targeted", optional: false },
            { name: "threshold", input: "Temperature to trigger", optional: false },
        ],
        temperature_change,
        [
            { name: "city", description: "City targeted" },
            { name: "description", description: "Description of weather" },
            { name: "temperature", description: "Current temperature" },
        ]
    ),
];

const OPENWEATHER_ACTIONS = [];

const DATETIME_INGREDIENTS = [
    { name: "date", description: "The current date when the trigger is activated" },
    { name: "day", description: "The current day (e.g., Monday, Tuesday)" },
    { name: "month", description: "The current month when the trigger is activated" },
    { name: "year", description: "The current year when the trigger is activated" },
    { name: "hour", description: "The current hour when the trigger is activated" },
    { name: "minute", description: "The current minute when the trigger is activated" },
];

const DATETIME_TRIGGERS = [
    new Trigger(
        "every_day_at",
        "Triggers every single day at a specific time set by you",
        [
            { name: "target_hour", input: "Hour (00-23)", optional: false },
            { name: "target_minute", input: "Minute (00-59)", optional: false },
        ],
        everyDayAt,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_hour_at",
        "Triggers once an hour at :00, :15, :30, or :45 min past the hour",
        [{ name: "target_minute", input: "Minute (00, 15, 30, 45)", optional: false }],
        everyHourAt,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_day_of_the_week_at",
        "Triggers only on specific days of the week at the time you provide",
        [
            { name: "days_array", input: "Days (e.g., Monday, Wednesday)", optional: false },
            { name: "target_hour", input: "Hour (00-23)", optional: false },
            { name: "target_minute", input: "Minute (00-59)", optional: false },
        ],
        everyDayOfTheWeekAt,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_month_on_the",
        "Triggers every month on the day and time you specify",
        [
            { name: "target_day", input: "Day of the month (1-31)", optional: false },
            { name: "target_hour", input: "Hour (00-23)", optional: false },
            { name: "target_minute", input: "Minute (00-59)", optional: false },
        ],
        everyMonthOnThe,
        DATETIME_INGREDIENTS
    ),
    new Trigger(
        "every_year_on",
        "Triggers once a year on the date and time you specify",
        [
            { name: "target_month", input: "Month (1-12)", optional: false },
            { name: "target_day", input: "Day of the month (1-31)", optional: false },
            { name: "target_hour", input: "Hour (00-23)", optional: false },
            { name: "target_minute", input: "Minute (00-59)", optional: false },
        ],
        everyYearOn,
        DATETIME_INGREDIENTS
    ),
];

const DATETIME_ACTIONS = [];

const SPOTIFY_TRIGGERS = [
    new Trigger("new_saved_track", "Triggers every time you save a new track on Spotify", [], newSavedTrack, [
        { name: "song_name", description: "Name of the saved song" },
        { name: "song_id", description: "ID of the saved song" },
        { name: "artist", description: "Artist of the saved song" },
        { name: "trackURL", description: "URL of the saved track" },
        { name: "coverURL", description: "Cover image URL of the saved track" },
    ]),
    new Trigger("new_saved_album", "Triggers every time you save a new album on Spotify", [], newSavedAlbum, [
        { name: "album_name", description: "Name of the saved album" },
        { name: "album_id", description: "ID of the saved album" },
        { name: "artist", description: "Artist of the saved album" },
        { name: "albumURL", description: "URL of the saved album" },
        { name: "coverURL", description: "Cover image URL of the saved album" },
    ]),
    new Trigger("new_recently_played_track", "Triggers every time you have played a new track on Spotify", [], newRecentlyPlayedTrack, [
        { name: "song_name", description: "Name of played song" },
        { name: "song_id", description: "ID of played song" },
        { name: "artist", description: "Artist of played song" },
        { name: "trackURL", description: "URL of played track" },
        { name: "coverURL", description: "Cover image URL of played track" },
    ]),
    new Trigger(
        "new_track_added_to_playlist",
        "Triggers every time a new track is added to a specified Spotify playlist",
        [{ name: "target_playlist_id", input: "ID of the Spotify playlist to monitor", optional: false }],
        newTrackAddedToPlaylist,
        [
            { name: "song_name", description: "Name of the song" },
            { name: "song_id", description: "ID of the song" },
            { name: "playlist_name", description: "Name of the target playlist" },
            { name: "playlist_id", description: "ID of the target playlist" },
            { name: "artist", description: "Artist of the song" },
            { name: "trackURL", description: "URL of the track" },
            { name: "coverURL", description: "Cover image URL of the track" },
        ]
    ),
];

const SPOTIFY_ACTIONS = [
    new Action("follow_playlist", "Follows a specified Spotify playlist", [{ name: "playlist_id", input: "Spotify Playlist ID to follow" }], followPlaylist),
    new Action("save_track", "Save a track to Spotify library", [{ name: "track_id", input: "ID of the track to save" }], saveTrack),
    new Action(
        "add_track_to_playlist_by_id",
        "Adds a track to a playlist using TrackID",
        [
            { name: "playlist_id", input: "ID of the target playlist" },
            { name: "track_id", input: "Spotify Track ID to add to the playlist" },
        ],
        addToPlaylistById
    ),
];

const GITHUB_TRIGGERS = [
    new Trigger(
        "any_new_commit",
        "Triggers every time a new commit in a repo is created on Github",
        [{ name: "repository_name", input: "Repository name", optional: false }],
        anyNewCommit,
        [
            { name: "commit_message", description: "The commit message" },
            { name: "committer_name", description: "Name of the person who made the commit" },
            { name: "commit_date", description: "The date and time the commit was made" },
            { name: "commit_url", description: "URL to view the commit on GitHub" },
            { name: "repository_name", description: "Name of the repository where the commit was made" },
        ]
    ),
    new Trigger("any_new_issue", "Triggers every time a new issue is created", [], anyNewIssue, [
        { name: "issue_title", description: "Title of the issue" },
        { name: "issue_url", description: "URL of the issue" },
        { name: "issue_body", description: "Description of the issue" },
        { name: "issue_creator", description: "Username of the issue creator" },
        { name: "issue_date", description: "Date the issue was created" },
        { name: "repository_name", description: "Name of the repository where the issue was created" },
    ]),
    new Trigger("new_issue_assigned_to_you", "Triggers every time a new issue is assigned to you", [], newIssueAssignedToYou, [
        { name: "issue_title", description: "Title of the issue" },
        { name: "issue_url", description: "URL of the issue" },
        { name: "issue_body", description: "Description of the issue" },
        { name: "issue_creator", description: "Username of the issue creator" },
        { name: "assigned_to_you_date", description: "Date the issue was assigned to you" },
        { name: "repository_name", description: "Name of the repository where the issue was created" },
    ]),
    new Trigger("new_repository", "Triggers every time a new repository is created by you", [], newRepository, [
        { name: "repository_name", description: "Name of the repository" },
        { name: "repository_description", description: "Description of the repository" },
        { name: "repository_url", description: "URL of the repository" },
        { name: "repository_owner", description: "Username of the repository owner" },
        { name: "repository_date", description: "Date the repository was created" },
    ]),
];

const GITHUB_ACTIONS = [
    new Action(
        "create_issue",
        "This Action will create a new issue for the repository you specify",
        [
            { name: "repository_name", input: "Name of the respository" },
            { name: "title", input: "Issue title" },
            { name: "body", input: "Issue body (description)" },
        ],
        createIssue
    ),
];

const TWITCH_TRIGGERS = [
    new Trigger(
        "stream_live_for_channel",
        "Triggers if a stream is live for the specified Channel that you follow",
        [{ name: "channel_name", input: "Name of the channel you follow", optional: false }],
        streamGoingLiveForChannel,
        [
            { name: "twitch_stream_title", description: "Title of the live stream" },
            { name: "twitch_streamer_name", description: "Name of the streamer" },
            { name: "twitch_stream_url", description: "URL to the live stream" },
            { name: "twitch_viewers_count", description: "Current number of viewers" },
            { name: "twitch_stream_started_at", description: "Date and time when the stream started" },
            { name: "twitch_game_being_played", description: "Name of the game being streamed" },
        ]
    ),
    new Trigger("you_follow_new_channel", "This trigger fires every time you follow a new channel on Twitch", [], youFollowNewChannel, [
        { name: "twitch_channel_name", description: "Name of the channel you followed" },
        { name: "twitch_channel_url", description: "URL to the channel's page" },
        { name: "twitch_followed_date", description: "Date when you followed the channel" },
    ]),
    new Trigger("new_follower_on_your_channel", "This trigger fires every time there is a new follower of your channel", [], newFollowerOnYourChannel, [
        { name: "twitch_follower_username", description: "Username of the new follower" },
        { name: "twitch_follower_profile_url", description: "URL to the follower's Twitch profile" },
        { name: "twitch_followed_date", description: "Date when they followed your channel" },
    ]),
];

const TWITCH_ACTIONS = [];

const YOUTUBE_TRIGGERS = [
    new Trigger("new_liked_video", "Triggers every time you like a video on YouTube", [], newLikedVideo, [
        { name: "youtube_video_title", description: "Title of the liked video" },
        { name: "youtube_channel_name", description: "Name of the channel that uploaded the video" },
        { name: "youtube_video_url", description: "URL to the video" },
        { name: "youtube_published_date", description: "Date and time when the video was published" },
        { name: "youtube_video_description", description: "Description of the video" },
    ]),
    new Trigger(
        "new_video_by_channel",
        "Triggers every time a specific channel publishes a video",
        [{ name: "channel_id", input: "Enter the Channel ID", optional: false }],
        newVideoByChannel,
        [
            { name: "youtube_video_title", description: "Title of the new video" },
            { name: "youtube_channel_name", description: "Name of the channel that uploaded the video" },
            { name: "youtube_video_url", description: "URL to the video" },
            { name: "youtube_published_date", description: "Date and time when the video was published" },
            { name: "youtube_video_description", description: "Description of the video" },
        ]
    ),
    new Trigger("new_subscription", "This trigger fires when a new subscription is made by a specific channel", [], newSubscription, [
        { name: "youtube_channel_name", description: "Name of the channel you subscribed to" },
        { name: "youtube_channel_url", description: "URL to the channel's page" },
        { name: "youtube_subscribed_date", description: "Date and time when you subscribed" },
    ]),
];

const YOUTUBE_ACTIONS = [new Action("like_video", "Likes a specified video", [{ name: "video_id", input: "YouTube Video ID to like", optional: false }], likeVideo)];

const GMAIL_ACTIONS = [
    new Action(
        "send_email",
        "This Action will send an email to up to 10 recipients from your Gmail account.",
        [
            { name: "to_address", input: "To address", optional: false },
            { name: "cc_address", input: "CC address (Optional)", optional: true },
            { name: "bcc_address", input: "BCC address (Optional)", optional: true },
            { name: "subject", input: "Subject", optional: false },
            { name: "body", input: "Body", optional: false },
            { name: "attachment_url", input: "Attachment URL (Optional)", optional: true },
        ],
        sendEmail,
        []
    ),

    new Action(
        "send_email_to_self",
        "This action will send yourself an email. HTML, images and links are supported.",
        [
            { name: "subject", input: "Subject", optional: false },
            { name: "body", input: "Body", optional: false },
            { name: "attachment_url", input: "Attachment URL (Optional)", optional: true },
        ],
        sendEmailToSelf
    ),
];

const GMAIL_TRIGGERS = [];

const DROPBOX_TRIGGERS = [
    new Trigger(
        "new_file_in_folder",
        "This Trigger fires every time any file is saved in the folder you specify",
        [{ name: "folder_path", input: "Path to the Dropbox folder", optional: false }],
        newFileInFolder,
        [
            { name: "file_name", description: "Name of the new file" },
            { name: "folder_path", description: "Path to the Dropbox" },
        ]
    ),
    new Trigger("new_shared_file_link", "This trigger fires every time a shared link for a file is created.", [], newSharedFileLink, [
        { name: "file_url", description: "Shared link URL of the file" },
        { name: "file_name", description: "Name of the file" },
    ]),
];

const DROPBOX_ACTIONS = [
    new Action(
        "add_file_from_url",
        "This Action will download a file at a given URL and add it to Dropbox at the path you specify.",
        [
            { name: "file_to_upload_url", input: "URL of the file to upload", optional: false },
            { name: "file_to_upload_name", input: "Name of the file to upload", optional: false },
            { name: "folder_path", input: "Path in Dropbox", optional: false },
        ],
        uploadFileFromURL
    ),
];

exports.AREAS = {
    dateTime: new Area(DATETIME_TRIGGERS, DATETIME_ACTIONS, "#333333"),
    openWeather: new Area(OPENWEATHER_TRIGGERS, OPENWEATHER_ACTIONS, "#E96D49"),
    spotify: new Area(SPOTIFY_TRIGGERS, SPOTIFY_ACTIONS, "#1DB954"),
    github: new Area(GITHUB_TRIGGERS, GITHUB_ACTIONS, "#4078C0"),
    twitch: new Area(TWITCH_TRIGGERS, TWITCH_ACTIONS, "#6441A5"),
    youtube: new Area(YOUTUBE_TRIGGERS, YOUTUBE_ACTIONS, "#FF0000"),
    gmail: new Area(GMAIL_TRIGGERS, GMAIL_ACTIONS, "#BF02AF"),
    dropbox: new Area(DROPBOX_TRIGGERS, DROPBOX_ACTIONS, "#0062FE"),
};
