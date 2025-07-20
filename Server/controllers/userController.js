import JobApplication from '../models/jobApplication.js'
import User from '../models/User.js'
import Job from '../models/job.js'
import{v2 as cloudinary} from 'cloudinary'





// Get user data
export const getUserData = async(req,res) =>{
   

    try {
         const userId = req.auth.userId
        const user = await User.findById(userId)

        if (!user) {

            return res.json({success :false , message: 'User Not Found'})
        }

        res.json({success:true ,user})
    } catch (error) {
        res.json({success:false ,message:error.message})
    }
}


// apply for a job 
export const applyForJob = async (req,res)=>
{

    const {jobId} = req.body

    const userId = req.auth.userId

    try {
        const isAlreadyApllied = await JobApplication.find({jobId,userId})

        if(isAlreadyApllied.length >0){
            return res.json({
                success:false,message:'Already Applied'
            })
        }
        const jobData = await Job.findById(jobId)
        if(!jobData){
            return res.json({success:false , message:"Job Not Found"})
        }
        await JobApplication.create({
            companyId: jobData.companyId,
            userId,
            jobId,
            date:Date.now()

        })
        res.json({success:true, message:'Applied Sucessfully'})


    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
    }
}



// get user applied application

export const getUserJobApplications = async (req, res) => {
    try {
        const userId = req.auth.userId
        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location category level salary')
            .exec()

        // Filter out applications where jobId or companyId is null
        const validApplications = applications.filter(app => app.jobId && app.companyId)

        if (validApplications.length === 0) {
            return res.json({ success: false, message: 'No Job Applications Found' })
        }

        return res.json({ success: true, applications: validApplications })

    } catch (error) {
        console.error('Error in getUserJobApplications:', error)
        res.json({ success: false, message: error.message })
    }
}

// update user profile (resume)

import streamifier from 'streamifier';

export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file;

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "No resume file received",
      });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw', // 📄 For PDFs & docs
            folder: 'resumes',
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(resumeFile.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    // ✅ Save to user
    const user = await User.findById(userId);
    user.resume = result.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume Updated",
      resumeUrl: result.secure_url,
    });

  } catch (error) {
    console.error("❌ Resume upload failed:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
