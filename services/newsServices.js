require('dotenv').config();

console.log("NEWS_API_KEY:", process.env.NEWS_API_KEY);

const NewsAPI = require('newsapi');

const newsApi = new NewsAPI(process.env.NEWS_API_KEY);

const getSources = async ({ category, country, language }) => {
    const response = await newsApi.v2.sources({
        category,
        country,
        language,
    });

    return response;
};

const getTopHeadlines = async (options = {}) => {
    // NewsAPI's topHeadlines requires at least one of: country, category, sources, or q.
    // Default to a sane fallback (US) if the caller doesn't specify one, so /news
    // doesn't error out with "parameters missing" on a bare GET request.
    const params = {
        country: options.country || 'us',
        ...options,
    };

    const response = await newsApi.v2.topHeadlines(params);

    return response;
};

module.exports = { getSources, getTopHeadlines };