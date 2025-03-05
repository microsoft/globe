import { loadEnvFile } from "node:process";

// We need to load the local .env file to access some variables needed when
// testing.
loadEnvFile(".env.test");