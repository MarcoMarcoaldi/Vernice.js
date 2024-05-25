# Vernice.js
## A Node.js Middleware for Purging Varnish Cache in GHOST CMS via Webhook

![image](https://github.com/MarcoMarcoaldi/Vernice.js/assets/113010551/201b5358-8719-4df0-8c6f-34953a62ff9e)


Vernice.js is designed as a middleware written in Node.js that acts as an intermediary between Ghost and Varnish. It operates independently of both systems, receiving webhook calls from Ghost, processing the received data, and interfacing with Varnish to perform selective cache purging.

### How It Works
When Ghost sends a webhook call following the publication, update, or deletion of content, Vernice.js receives this request. Ghost webhooks include a JSON payload containing relevant details, such as the URL of the modified content. Vernice.js extracts the URLs involved in the purging process, including the specific content URL and the site’s homepage.

### Steps Involved:
Receiving Webhooks: Ghost sends a webhook with a JSON payload after content changes.
Extracting URLs: Vernice.js analyzes the JSON payload to obtain urlObject.pathname and urlObject.host. These details are crucial because Varnish cannot directly process a JSON payload.
Formatting Purge Requests: Using the extracted information, Vernice.js formats the purge requests appropriately for Varnish.
Sending PURGE Requests: Vernice.js sends HTTP PURGE requests to Varnish for the specified path and the homepage, allowing Varnish to selectively invalidate the cache only for the affected URLs.
Example Process
Once the necessary details are extracted, Vernice.js sends a PURGE HTTP request to Varnish for the specific path and the homepage. This enables Varnish to selectively invalidate the cache for the affected URLs, ensuring users always receive the most up-to-date content. Although the command sent is of type PURGE, Varnish can be configured to translate this command into a BAN, which is an effective method for selective cache cleaning.

### Why Use Vernice.js?
Directly linking Ghost webhooks to Varnish is impractical because Varnish cannot interpret and handle a JSON payload sent by Ghost webhooks. Vernice.js solves this problem by acting as an intermediary, translating the webhook information into a format that Varnish can understand.

### Advantages Over Other Solutions
Unlike other solutions found online and in various GitHub repositories, which tend to clear the entire cache when a post is updated or a new post is published, Vernice.js is meticulous in performing a granular and selective purge of only the updated content. For instance, in a Ghost blog with 100,000 posts, if a single post is updated, Vernice.js will purge the homepage and the URL of the updated post, leaving all other posts cached.

This approach allows for an exceptionally high HIT RATIO, making the cache particularly efficient with all the consequent advantages.

### Requirements
Node.js and express, axios, url, body-parser. Varnish Cache 3.0 or Higher. A Linux OS support systemd.

### License
This project is licensed under the AGPL 3.0 License https://www.gnu.org/licenses/agpl-3.0.en.html


