export interface ServiceOAuthConstants {
    clientId: string;
    redirectUri: string;
    scopes: string[];
    oAuthSessionId: string;
    accessType?: string;
    prompt?: string;
}

export const servicesAuthorize: { [key: string]: string }[] = [
    { spotify: 'https://accounts.spotify.com/authorize' },
    { youtube: 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent' },
    { gmail: 'https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&prompt=consent' },
    { github: 'https://github.com/login/oauth/authorize'},
    { twitch: 'https://id.twitch.tv/oauth2/authorize'},
    { dropbox: 'https://www.dropbox.com/oauth2/authorize?token_access_type=offline'},
];


export function getServiceAuthorizeByName(key: string): string | undefined {
    const item = servicesAuthorize.find(obj => obj.hasOwnProperty(key));

    return item ? item[key] : undefined;
}

