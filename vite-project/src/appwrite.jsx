// appwriteConfig.js
import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
    .setEndpoint("https://cloud.appwrite.io/v1") // or your Appwrite endpoint
    .setProject("67f299290007f7877e95"); // replace with your actual Project ID

const account = new Account(client);
const databases = new Databases(client);

export { account, databases };
