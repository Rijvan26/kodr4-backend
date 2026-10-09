import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from "mongoose";

async function runMigration() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("No MONGO_URI provided");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const collection = mongoose.connection.collection("users");
  const users = await collection.find({}).toArray();

  console.log("=== USERS BEFORE MIGRATION ===");
  for (const u of users) {
    console.log(`User: ${u.username}, coffeePrice: ${u.coffeePrice}`);
  }

  for (const u of users) {
    let newPrice = u.coffeePrice;
    if (typeof newPrice === "number") {
      if (newPrice >= 2000 && newPrice <= 50000 && newPrice % 100 === 0) {
        newPrice = newPrice / 100;
      }
    }
    if (typeof newPrice !== "number" || newPrice < 20 || newPrice > 500) {
      newPrice = 100;
    }

    await collection.updateOne(
      { _id: u._id },
      { $set: { coffeePrice: newPrice } }
    );
  }

  const updatedUsers = await collection.find({}).toArray();
  console.log("\n=== USERS AFTER MIGRATION ===");
  for (const u of updatedUsers) {
    console.log(`User: ${u.username}, coffeePrice: ${u.coffeePrice}`);
  }

  await mongoose.disconnect();
  console.log("\nMigration completed successfully.");
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
