import { connectToDatabase } from "@/app/lib/db";
import Contact from "@/models/Contact";
import User from "@/models/User"; // Assuming you have a User model

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
): Promise<Response> {
  try {
    // Ensure database connection is established
    // await connectToDatabase();

    // Log the username for debugging
    console.log("Fetching contact for username:", params.username);

    // Fetch the userId based on the username
    const user = await User.findOne({ username: params.username });

    // If user not found, return 404
    if (!user) {
      console.log("User not found for username:", params.username);
      return new Response(
        JSON.stringify({ error: "User not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch contacts for the found userId
    const contacts = await Contact.find({
      $or: [{ userId: user._id }, { contactId: user._id }],
    });

    // If no contacts found, return 404
    if (!contacts || contacts.length === 0) {
      console.log("No contacts found for userId:", user._id);
      return new Response(
        JSON.stringify({ error: "Contacts not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // If contacts are found, return the data
    return new Response(
      JSON.stringify(contacts),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
