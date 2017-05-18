<h1>Crawling and Scraping webpages using Node.js</h1>
<p> This is a relatively simple web crawler built using Node.js. In this example, the application attempts to crawl webpages within Business Insider and analyze word usage of an article by calculating each word's term frequency.</p>

<h2>Rationale</h2>
<ul>
  <li>1. Start from a homepage</li>
  <li>2. Search for links in the homepage and save it to an array</li>
  <li>3. Visit the links saved to the array</li>
  <li>4. Parse the page for contents and get term frequency for each word</li>
  <li>5. Search for more links in the newly found pages and save them to the array</li>
  <li>6. Repeat steps 3-6</li>
</ul>

<h2>Limitations</h2>
<p>This simple crawler visits pages that are added first to the array we created (i.e. FIFO). As a result we would bias to the links of a webpage that are stored at the beginning.</p>
