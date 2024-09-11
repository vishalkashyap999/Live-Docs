import { liveblocks } from "@/lib/liveblocks";
import { currentUser} from "@clerk/nextjs/server";
// import { colors } from "@clerk/themes/dist/clerk-js/src/ui/foundations/colors";
import {redirect} from "next/navigation";
import { getUserColor } from "@/lib/utils";
export async function POST(request: Request) {
  // Get the current user from your database
  const clerkUser = await currentUser();
  if(!clerkUser) redirect ('/sign-in');
  const {id, firstName, lastName, emailAddresses, imageUrl }= clerkUser;
  
  const user ={
    id,
    info:{
        id,
        name: `${firstName} ${lastName}`,
        email : emailAddresses[0].emailAddress,
        avatar: imageUrl,
        color: getUserColor(id),
    }
  }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [], // Optional
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}