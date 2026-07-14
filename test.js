import { createClient } from "redis";

const client = createClient({
  url: "redis://localhost:55000" // Redis exposed on port 55000
});

client.on("error", (err) => console.error("Redis error:", err));

async function main() {
  await client.connect();

  await client.set("name", "Alice");
  const value = await client.get("name");

  console.log(value); // Alice

  await client.quit();
}

main();