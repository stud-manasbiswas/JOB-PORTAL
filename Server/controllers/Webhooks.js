import { Webhook } from "svix";
import User from "../models/User.js";

// API Controller Function To Manage Clerk user with database
const ClerkWebhooks = async (req,res)=>{
    try{
        // Create a svix instance with clerk webhook secret
        const whook = new Webhook (process.env.CLERK_WEBHOOK_SECRET_RENDER)

        // Verifying Headers

      await whook.verify(req.body, {
  "svix-id": req.headers["svix-id"],
  "svix-timestamp": req.headers["svix-timestamp"],
  "svix-signature": req.headers["svix-signature"]
});
        // Getting Data from request body

        const {data,type} =req.body

        // Switch cases for different events

        switch (type) {
            case 'user.created':{

                const userData = {
                    _id:data.id,
                    email:data.email_addresses[0].email_addresses,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume : ' '
                }
                await User.create(userData)
                res.json({})
                break;

            }
            case 'user.updated':{
                    const userData = {
                    
                    email:data.email_addresses[0].email_addresses,
                    name: data.first_name + " " + data.last_name,
                    image: data.image_url,
                    
                }
                await User.findByIdAndUpdate(data.id,userData)
                res.json({})
                break;

            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;



            }
            default: break;
                
              
        }
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:'Webhooks error'})
    }
}

export default ClerkWebhooks