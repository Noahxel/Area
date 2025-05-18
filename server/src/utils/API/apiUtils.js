exports.makeApiCall = async function (url, method = "GET", headers = {}, body = null) {
    try {
        const options = {
            method: method,
            headers: headers,
        };
        if (body && method !== "GET") {
            options.body = JSON.stringify(body);
        }
        const response = await fetch(url, options);
        console.log(`Response Status: ${response.status}`);
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json();
            return jsonResponse;
        } else {
            const textResponse = await response.text();
            return textResponse;
        }
    } catch (error) {
        console.error("Error making API call:", error);
        throw error;
    }
};

exports.makeContentApiCall = async function (url, method, headers, body = null) {
    const options = {
        method: method,
        headers: headers,
        body: body,
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Content API call to ${url} failed: ${response.statusText}, Body: ${errorBody}`);
    }

    return await response.json();
};
