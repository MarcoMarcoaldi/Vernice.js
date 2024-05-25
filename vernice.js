/**
 *
 *
 *         (`-.      ('-.    _  .-')        .-') _                          ('-.
 *       _(OO  )_  _(  OO)  ( \( -O )      ( OO ) )                       _(  OO)
 *   ,--(_/   ,. \(,------.  ,------.  ,--./ ,--,'   ,-.-')     .-----.  (,------.
 *   \   \   /(__/ |  .---'  |   /`. ' |   \ |  |\   |  |OO)   '  .--./   |  .---'
 *    \   \ /   /  |  |      |  /  | | |    \|  | )  |  |  \   |  |('-.   |  |
 *     \   '   /, (|  '--.   |  |_.' | |  .     |/   |  |(_/  /_) |OO  ) (|  '--.
 *      \     /__) |  .--'   |  .  '.' |  |\    |   ,|  |_.'  ||  |`-'|   |  .--'
 *       \   /     |  `---.  |  |\  \  |  | \   |  (_|  |    (_'  '--'\   |  `---.
 *        `-'      `------'  `--' '--' `--'  `--'    `--'       `-----'   `------'
 *
 *
 *
 *  VERNICE.JS a Ghost <=> Varnish Middleware Selective Cache Purger and Daemon Cleaner.
 *
 *  Copyright (c) 2024 - Managed Server S.r.l. - Licensed under AGPL 3.0 https://www.gnu.org/licenses/agpl-3.0.en.html
 *
 *
 *  Description:
 *  This Node.js middleware is designed to bridge the Ghost CMS with a selective Varnish Purging system.
 *  It listens for webhooks from Ghost related to content changes (like posts, pages, tags) and triggers
 *  selective cache purging in Varnish. This ensures that the content served to users is always fresh and up-to-date.
 *
 *  Requirement:
 *  Node.js and express, axios, url, body-parser. Varnish Cache 3.0 or Higher. A Linux OS support systemd.
 *
 *  Usage:
 *  Run this script in a Node.js environment. Configure Ghost to send webhooks to this middleware.
 *  The middleware will process these webhooks and send requests to the Varnish server to purge the cache as needed.
 *
 *  Note:
 *  Ensure that webhooks in Ghost and Varnish cache purging rules are correctly set up for this middleware to function properly.
 *
 */
 
 
const express = require('express');
const axios = require('axios');
const { URL } = require('url');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
 
 
console.log('\x1b[32m%s\x1b[0m',
    " \n" +
    "      (`-.      ('-.    _  .-')        .-') _                           ('-.         \n" +
    "     _(OO  )_  _(  OO)  ( \\( -O )      ( OO ) )                        _(  OO)        \n" +
    " ,--(_/   ,. \\(,------.  ,------.  ,--./ ,--,'    ,-.-')     .-----.  (,------.       \n" +
    " \\   \\   /(__/ |  .---'  |   /`. ' |   \\ |  |\\    |  |OO)   '  .--./   |  .---'       \n" +
    "  \\   \\ /   /  |  |      |  /  | | |    \\|  | )   |  |  \\   |  |('-.   |  |           \n" +
    "   \\   '   /, (|  '--.   |  |_.' | |  .     |/    |  |(_/  /_) |OO  ) (|  '--.        \n" +
    "    \\     /__) |  .--'   |  .  '.' |  |\\    |    ,|  |_.'  ||  |`-'|   |  .--'        \n" +
    "     \\   /     |  `---.  |  |\\  \\  |  | \\   |   (_|  |    (_'  '--'\\   |  `---.       \n" +
    "      `-'      `------'  `--' '--' `--'  `--'     `--'       `-----'   `------'  \n" +
    "\n"+
    " VERNICE.JS a Ghost <=> Varnish Middleware Selective Cache Purger and Daemon Cleaner. \n"+
    "\n" +
    " Copyright (c) 2024 - Managed Server S.r.l. - Licensed under AGPL 3.0 \n" +
    "\n"
 
);
 
 
 
app.use(bodyParser.json({ limit: '64mb' }));
 
app.post('/webhook', async (req, res) => {
    if (req.body.post && req.body.post.current && req.body.post.current.url) {
        const fullUrl = req.body.post.current.url;
        const urlObject = new URL(fullUrl);
        const postPath = urlObject.pathname;
        const host = urlObject.host;
 
        console.log(`PURGE Request for the URL path: ${postPath} e host: ${host}`);
 
        try {
            // Make PURGE Request for the home page
            axios.request({
                method: 'PURGE',
                url: 'http://127.0.0.1:80/',
                headers: { 'Host': host }
            }).catch(error => {
                console.error('Error for home page PURGE call.', error);
            });
 
            // Make a PURGE request for the specific URL modified.
            axios.request({
                method: 'PURGE',
                url: `http://127.0.0.1:80${postPath}`,
                headers: { 'Host': host }
            }).catch(error => {
                console.error('Error PURGE call for a specific URL: ', error);
            });
 
            res.status(200).send('Richieste di PURGE inviate');
        } catch (error) {
            console.error('Generic error in the try block', error);
            res.status(500).send('Error when send PURGE request to Varnish');
        }
    } else {
        console.log('Invalid webhook payload or missing crucial information');
        res.status(400).send('Webhook Request not valid.');
    }
});
 
app.listen(port, () => {
    console.log(`Server VERNICE.JS running and listening on TCP PORT ${port}`);
});
