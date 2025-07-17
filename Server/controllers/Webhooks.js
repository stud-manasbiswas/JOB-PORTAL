import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function To Manage Clerk user with database
const ClerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with Clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verifying Headers
    await whook.verify(
      JSON.stringify(req.body),
      {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      }
    );

    // Destructure data and event type
    const { data, type } = req.body;

    // Switch cases for different events
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address, // ✅ FIXED
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
          resume: " ",
        };

        await User.create(userData);
        console.log("✅ New user created:", userData.email);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address, // ✅ FIXED
          name: `${data.first_name} ${data.last_name}`,
          image: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);
        console.log("✅ User updated:", userData.email);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("❌ User deleted:", data.id);
        res.json({});
        break;
      }

      default: {
        console.log("⚠️ Unhandled webhook type:", type);
        res.json({});
        break;
      }
    }
  } catch (error) {
    console.error("❌ Webhook error:", error.message);
    res.status(400).json({ success: false, message: "Webhook processing error" });
  }
};

export default ClerkWebhooks;
