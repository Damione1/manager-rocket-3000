# 🚀 Manager Rocket 3000 🚀

<img src="public\manager-rocket.svg" alt="Manager Rocket 3000" width="50%" text-align="center">

🔓 Unlock your Lightspeed store's full potential!

Manager Rocket 3000 is a web app designed to skyrocket your efficiency by integrating with your Lightspeed store seamlessly. Built with Nextjs and connected to the Lightspeed API, this project aims to bridge the feature gap of the Lightspeed store.

Currently, I implemented one feature, the UPC Rocket.

## UPC Rocket

UPC Rocket is a straightforward form that allows you to scan a product's internal barcode and then update the product with the UPC code directly on your Lightspeed store database. This allows you to identify the product on other marketplaces, like Amazon.
Just load it on your phone/tablet with a Bluetooth scanner, and it'll be a breeze to update your inventory.

## How to run

To use this app, you need to register the https link to the app on Lightspeed [here](https://cloud.lightspeedapp.com/oauth/register.php), and then put the client and secret in the `.env` file. The callback URL for the oauth flow is `https://domain.com/api/auth/callback/lightspeed`.

Use the 'one click login' to go to the Lightspeed authentication using the `employee:inventory` scope.

**[Access app here](https://manager-rocket-3000.damiengoehrig.ca/)**

Defined as a blank canvas, Manager Rocket 3000 lets you add store-related features that Lightspeed might be missing. Inceptionally, Manager Rocket 3000 is a reboot project of the original Manager Rocket, a key tool previously built in PHP with a lot of custom-made features.

## History

The original project "Manager Rocket" was an internally built software several years ago for a store using a local POS and a SQL database. It didn't have a framework and was insecure to the extent that making it accessible over internet would have been a terrible idea. Towards the end of its life, it turned out to be a crucial tool for the shop with a lot of features custom made for many employee needs. However, it was then replaced by an online POS (Lightspeed) and a Shopify store. Most of the features were implemented with these solutions, except for UPC Rocket. Hence, the birth of this repository.

In its previous avatar, Manager Rocket had an array of features :

- UPC Rocket
- A complete Online Order workflow
- An interface aiding to update products for website synchronization (with Nitrosell)
- Reporting and invoicing
- Product thumbnail assets generator for the website
- Label generator for the store

These features hold the potential for future development in Manager Rocket 3000 to meet the specific needs of store owners and employees.

**Blast off with me to a whole new world of easy inventory management and beyond!**
