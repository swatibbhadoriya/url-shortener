const { Op } = require('sequelize');
const URL = require('../models/URL');
const logger = require('../utils/logger');

// Track URL click with successful and failed clicks
exports.trackURL = async (req, res) => {
  const { short_url } = req.params;

  try {
    const url = await URL.findOne({ where: { short_url } });
    if (!url) {
      logger.info(`Failed click on short URL: ${short_url}`);
      await URL.increment('failed_click_count', { where: { short_url } });
      return res.status(404).json({ error: 'URL not found' });
    }

    // Successful click - increment click count and update last access details
    url.click_count += 1;
    url.last_access = new Date();
    await url.save();

    res.redirect(url.original_url);
    logger.info(`Successful click on short URL: ${short_url} by IP: ${req.ip}`);
  } catch (error) {
    logger.error(`Redirection failed for short URL: ${short_url} - ${error}`);
    res.status(500).json({ error: 'Redirection failed' });
  }
};

// Create new shortened URL
exports.createShortURL = async (req, res) => {
  const { original_url, friendly_name } = req.body;
  const short_url = Math.random().toString(36).substring(7);

  try {
    const newURL = await URL.create({
      original_url,
      short_url,
      friendly_name,
      userId: req.user.userId,
    });

    logger.info(`Created short URL: ${short_url} for user: ${req.user.userId}`);
    res.status(201).json({ message: 'URL shortened successfully', newURL });
  } catch (error) {
    logger.error(`Error creating short URL for user: ${req.user.userId} - ${error}`);
    res.status(500).json({ error: 'URL shortening failed' });
  }
};

// Get user URLs with optional search & date filters
exports.getUserURLs = async (req, res) => {
  const { search, date } = req.query;
  const whereClause = { userId: req.user.userId };
  if (search) whereClause.friendly_name = { [Op.like]: `%${search}%` };
  if (date) whereClause.createdAt = { [Op.gte]: new Date(date) };

  try {
    const urls = await URL.findAll({ where: whereClause });
    if (urls.length === 0) {
      logger.info(`No URLs found for user: ${req.user.userId} with applied filters`);
    }
    res.json({ urls });
  } catch (error) {
    logger.error(`Error fetching URLs for user: ${req.user.userId} - ${error}`);
    res.status(500).json({ error: 'Fetching URLs failed' });
  }
};

// Update a URL
exports.updateURL = async (req, res) => {
  const { short_url } = req.params;
  const { original_url, friendly_name } = req.body;

  try {
    const url = await URL.findOne({ where: { short_url, userId: req.user.userId } });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    url.original_url = original_url || url.original_url;
    url.friendly_name = friendly_name || url.friendly_name;
    await url.save();

    logger.info(`Updated URL: ${short_url} for user: ${req.user.userId}`);
    res.json({ message: 'URL updated successfully', url });
  } catch (error) {
    logger.error(`Error updating URL: ${short_url} for user: ${req.user.userId} - ${error}`);
    res.status(500).json({ error: 'Updating URL failed' });
  }
};

// Delete a URL
exports.deleteURL = async (req, res) => {
  const { short_url } = req.params;

  try {
    const url = await URL.findOne({ where: { short_url, userId: req.user.userId } });
    if (!url) return res.status(404).json({ error: 'URL not found' });

    await url.destroy();
    logger.info(`Deleted URL: ${short_url} for user: ${req.user.userId}`);
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting URL: ${short_url} for user: ${req.user.userId} - ${error}`);
    res.status(500).json({ error: 'Deleting URL failed' });
  }
};
