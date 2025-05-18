const axios = require("axios");
const User = require("../../../models/userModels");
const { getGithubToken } = require("../../token/servicesTokenUtils");
const { isIngredient } = require("../../ingredients/ingredientsHelper");

const ALLOWED_INGREDIENTS_FOR_ACTIONS = {
    create_issue: {
        repository_name: ["repository_name"],
        title: [
            "commit_date",
            "committer_name",
            "commit_message",
            "repository_name",
            "issue_title",
            "issue_body",
            "issue_creator",
            "issue_date",
            "assigned_to_you_date",
            "repository_description",
            "repository_owner",
            "repository_date",
            "date",
            "day",
            "month",
            "year",
            "hour",
            "minute",
            "twitch_stream_title",
            "twitch_streamer_name",
            "twitch_viewers_count",
            "twitch_stream_started_at",
            "twitch_game_being_played",
            "twitch_channel_name",
            "twitch_channel_followers_count",
            "twitch_channel_total_views",
            "twitch_followed_date",
            "twitch_follower_username",
            "youtube_video_title",
            "youtube_channel_name",
            "youtube_published_date",
            "youtube_video_description",
            "youtube_subscribed_date",
        ],
        body: [
            "commit_date",
            "commit_url",
            "committer_name",
            "commit_message",
            "repository_name",
            "issue_title",
            "issue_body",
            "issue_creator",
            "issue_date",
            "assigned_to_you_date",
            "repository_description",
            "repository_owner",
            "repository_date",
            "repository_url",
            "issue_url",
            "date",
            "day",
            "month",
            "year",
            "hour",
            "minute",
            "twitch_stream_title",
            "twitch_streamer_name",
            "twitch_stream_url",
            "twitch_viewers_count",
            "twitch_stream_started_at",
            "twitch_game_being_played",
            "twitch_channel_name",
            "twitch_channel_url",
            "twitch_channel_followers_count",
            "twitch_channel_total_views",
            "twitch_followed_date",
            "twitch_follower_username",
            "twitch_follower_profile_url",
            "youtube_video_title",
            "youtube_channel_name",
            "youtube_video_url",
            "youtube_published_date",
            "youtube_video_description",
            "youtube_subscribed_date",
        ],
    },
};

async function checkRepositoryExists(userId, repoName) {
    const token = await getGithubToken(userId);
    let found = false;

    try {
        const userReposEndpoint = `https://api.github.com/user/repos`;
        const userReposResponse = await axios.get(userReposEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });

        found = userReposResponse.data.some((repository) => repository.name.toLowerCase() === repoName.toLowerCase());
        if (found) {
            console.log(`Repository found in user's personal repositories: ${repoName}`);
            return true;
        }
    } catch (error) {
        console.log(`Error while checking user's personal repositories: ${error.message}`);
        if (error.response.status !== 404) {
            return false;
        }
    }
    if (!found) {
        try {
            const orgsEndpoint = `https://api.github.com/user/orgs`;
            const orgsResponse = await axios.get(orgsEndpoint, {
                headers: { Authorization: `Bearer ${token}` },
            });

            for (const org of orgsResponse.data) {
                try {
                    const orgReposEndpoint = `https://api.github.com/orgs/${org.login}/repos`;
                    const orgReposResponse = await axios.get(orgReposEndpoint, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    found = orgReposResponse.data.some((repository) => repository.name.toLowerCase() === repoName.toLowerCase());
                    if (found) {
                        console.log(`Repository found in organization ${org.login}: ${repoName}`);
                        return true;
                    }
                } catch (orgError) {
                    console.log(`Error while checking organization repositories for ${org.login}: ${orgError.message}`);
                    if (orgError.response && orgError.response.status !== 404) {
                        return false;
                    }
                }
            }
        } catch (error) {
            console.log(`Error while fetching organizations: ${error.message}`);
            return false;
        }
    }
    console.log(`Repository ${repoName} not found.`);
    return false;
}

exports.checkGithubParameters = async function (userId, parameters, actionName) {
    for (let param of parameters) {
        switch (param.name) {
            case "repository_name":
                if (param.input === "<repository_name>") {
                    break;
                } else if (!param.input.includes("<") && !param.input.includes(">")) {
                    if (!(await checkRepositoryExists(userId, param.input))) {
                        throw new Error(`Invalid repository name provided`);
                    }
                } else {
                    throw new Error(`Invalid repository name provided`);
                }
                break;
            case "title":
            case "body":
                if (!param.input && param.input.trim() == "") {
                    throw new Error(`Invalid ${param.name} provided`);
                }
                break;
            default:
                const ingredientNamesInInput = (param.input.match(/<([^>]+)>/g) || []).map((ingredient) => ingredient.slice(1, -1));
                const allowedIngredients = ALLOWED_INGREDIENTS_FOR_ACTIONS[actionName]?.[param.name];
                if (!allowedIngredients || ingredientNamesInInput.some((ingredientName) => !allowedIngredients.includes(ingredientName))) {
                    throw new Error(`Invalid ingredient for parameter: ${param.name} in action: ${actionName}`);
                }
                break;
        }
    }
    return true;
};
