const newsServices = require("../services/newsServices");

const getNews = async (req, res) => {
    try {
        const response = await newsServices.getTopHeadlines(req.query);

        // NewsAPI's topHeadlines typically returns { status, totalResults, articles }
        // Adjust the line below if your newsServices wraps the response differently.
        const articles = response.articles || response;

        res.status(200).json({
            status: "ok",
            news: articles,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

const getSources = async (req, res) => {
    try {
        const response = await newsServices.getSources(req.query);

        res.status(200).json({
            status: "ok",
            response,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { getNews, getSources };