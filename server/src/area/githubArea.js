const User = require("../models/userModels");
const { getGithubToken } = require("../utils/token/servicesTokenUtils");
const { updateIngredients } = require("../utils/ingredients/ingredientsHelper");
const { processTriggerDataTotal } = require("../utils/area/areaValidation");
const { fetchGithubCommits, fetchGithubIssues, fetchAssignedGithubIssues, fetchCreateGithubIssue, fetchGithubRepositories } = require("../utils/API/githubAPI");

function getMostRecent(target) {
    if (!target || !target.length) return null;
    target.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return target[0];
}

exports.anyNewCommit = async function (areaEntry) {
    try {
        const accessToken = await getGithubToken(areaEntry.userId);
        const user = await User.findById(areaEntry.userId);
        const repoName = areaEntry.trigger.parameters[0].input;
        const username = user.connectServices.get("github").data.login;
        const commitsResponse = await fetchGithubCommits(accessToken, username, repoName);
        const recentCommit = getMostRecent(commitsResponse);
        if (!recentCommit)  return await processTriggerDataTotal(areaEntry, "commitId", "", 0);
        const totalCommits = commitsResponse.length;

        if (await processTriggerDataTotal(areaEntry, "commitId", recentCommit.sha, totalCommits)) {
            updateIngredients(areaEntry, [
                { name: "commit_message", value: recentCommit.commit.message },
                { name: "committer_name", value: recentCommit.author.login },
                { name: "commit_date", value: recentCommit.commit.committer.date.split("T")[0] },
                { name: "commit_url", value: recentCommit.html_url },
                { name: "repository_name", value: repoName },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in anyNewCommit function:", error);
        return false;
    }
};

exports.anyNewIssue = async function (areaEntry) {
    try {
        const accessToken = await getGithubToken(areaEntry.userId);
        const user = await User.findById(areaEntry.userId);
        const username = user.connectServices.get("github").data.login;
        const issuesResponse = await fetchGithubIssues(accessToken, username);
        const issues = issuesResponse.items;
        const recentIssue = getMostRecent(issues);
        if (!recentIssue) return await processTriggerDataTotal(areaEntry, "issueId", "", 0);
        const totalIssues = issuesResponse.total_count

        if (await processTriggerDataTotal(areaEntry, "issueId", recentIssue.id, totalIssues)) {
            updateIngredients(areaEntry, [
                { name: "issue_title", value: recentIssue.title },
                { name: "issue_url", value: recentIssue.html_url },
                { name: "issue_body", value: recentIssue.body },
                { name: "issue_creator", value: recentIssue.user.login },
                { name: "issue_date", value: recentIssue.created_at.split("T")[0] },
                { name: "repository_name", value: recentIssue.repository_url.split("/")[5] },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in anyNewIssue function:", error);
        return false;
    }
};

exports.newIssueAssignedToYou = async function (areaEntry) {
    try {
        const accessToken = await getGithubToken(areaEntry.userId);
        const user = await User.findById(areaEntry.userId);
        const username = user.connectServices.get("github").data.login;
        const assignedIssuesResponse = await fetchAssignedGithubIssues(accessToken, username);
        const issues = assignedIssuesResponse.items;
        const recentAssignedIssue = getMostRecent(issues);
        if (!recentAssignedIssue) return await processTriggerDataTotal(areaEntry, "assignedIssueId", "", 0);
        const totalRecentAssignedIssues = assignedIssuesResponse.total_count;

        if (await processTriggerDataTotal(areaEntry, "assignedIssueId", recentAssignedIssue.id, totalRecentAssignedIssues)) {
            updateIngredients(areaEntry, [
                { name: "issue_title", value: recentAssignedIssue.title },
                { name: "issue_url", value: recentAssignedIssue.html_url },
                { name: "issue_body", value: recentAssignedIssue.body },
                { name: "issue_creator", value: recentAssignedIssue.user.login },
                { name: "assigned_to_you_date", value: recentAssignedIssue.created_at.split("T")[0] },
                { name: "repository_name", value: recentAssignedIssue.repository_url.split("/")[5] },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newIssueAssignedToYou function:", error);
        return false;
    }
};

exports.newRepository = async function (areaEntry) {
    try {
        const accessToken = await getGithubToken(areaEntry.userId);
        const repos = await fetchGithubRepositories(accessToken);
        const recentRepository = getMostRecent(repos);
        if (!recentRepository) return await processTriggerDataTotal(areaEntry, "repoId", "", 0);
        const totalRecentRepositorys = repos.length;

        if (await processTriggerDataTotal(areaEntry, "repoId", recentRepository.id, totalRecentRepositorys)) {
            updateIngredients(areaEntry, [
                { name: "repository_name", value: recentRepository.name },
                { name: "repository_url", value: recentRepository.html_url },
                { name: "repository_description", value: recentRepository.description },
                { name: "repository_owner", value: recentRepository.owner.login },
                { name: "repository_date", value: recentRepository.created_at.split("T")[0] },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error in newRepository function:", error);
        return false;
    }
};

exports.createIssue = async function (userId, repoName, title, body) {
    try {
        const accessToken = await getGithubToken(userId);
        const user = await User.findById(userId);
        const username = user.connectServices.get("github").get("data").login;
        const issue = await fetchCreateGithubIssue(accessToken, username, repoName, title, body);
        return issue;
    } catch (error) {
        console.error("Error creating issue:", error);
        throw error;
    }
};
