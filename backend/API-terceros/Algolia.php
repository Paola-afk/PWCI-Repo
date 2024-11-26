<?php
require(__DIR__."/vendor/autoload.php");
use Algolia\AlgoliaSearch\Api\SearchClient;

// Fetch sample dataset
$url = "https://dashboard.algolia.com/sample_datasets/movie.json";
$response = file_get_contents($url);
$movies = json_decode($response, true);

// Connect and authenticate with your Algolia app
$client = SearchClient::create('ZR7VAKY7YN', '0da84c80ec2dfba704623e9a8464b560');

// Save records in Algolia index
$client->saveObjects(
  "movies_index",

  movies
)

print('Done!');
