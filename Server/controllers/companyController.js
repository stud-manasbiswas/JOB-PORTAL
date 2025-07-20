import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import generateToken from "../utils/generateToken.js";
import streamifier from "streamifier"; // ✅ Add this
import Job from "../models/job.js";
import JobApplication from "../models/jobApplication.js";

// Helper to upload buffer stream to Cloudinary
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'companies' },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          reject(error);
        } else {
          console.log("✅ Cloudinary Upload Result:", result);
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// register a new company
export const registerCompany = async (req, res) => {
  try {
    console.log("🔍 DEBUGGING REGISTER COMPANY");
    console.log("➡️ req.body:", req.body);
    console.log("📎 req.file:", req.file);

    const { name, email, password } = req.body;
    const imageFile = req.file;

    if (!name || !email || !password || !imageFile) {
        console.log("⛔ Missing:", { name, email, password, imageFile });
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ success: false, message: "Company already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // ⬇️ Upload buffer (not path!) to Cloudinary
    const imageUpload = await streamUpload(imageFile.buffer);

    const company = await Company.create({
      name,
      email,
      password: hashPassword,
      image: imageUpload.secure_url,
    });

    return res.status(201).json({
      success: true,
      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
      token: generateToken(company._id),
    });
  } catch (error) {
    console.error("❌ Register Error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// company login

export const loginCompany = async (req, res) => {
  const { email, password } = req.body;
  try {
    const company = await Company.findOne({email});
    if(await bcrypt.compare(password,company.password)){
        res.json({
            success:true,
            company:{
                id: company._id,
                name: company.name,
                email: company.email,
                image: company.image,
            },
            token: generateToken(company._id)

        })
    }
    else{
        res.json({success:false,message:'Invalid email or password'})
    }


  } catch (error) {

    res.json({success:false,message:error.message})
  }
};

// get company

export const getCompanyData = async (req, res) => {
    

    try {
        const company = req.company
        res.json({success:true,company})
    } catch (error) {
        res.json({
            success:false,
            message:error.message
        })
        
    }
};

// post a new job
export const postJob = async (req, res) => {
    const {title,description,location,salary,level,category} = req.body
    const companyId = req.company._id

    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
           companyId,
            date:Date.now(),
            level,
            category
        }

        )
        await newJob.save()

        res.json({success:true,newJob})


    } catch (error) {
        res.json({success:false,message:error.message})
        
    }

};

// get comapny job applicants
// get company job applicants
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.company._id;

    const applications = await JobApplication.find({ companyId })
      .populate('userId', 'name image resume')
      .populate('jobId', 'title location category level salary')
      .exec();

    // ✅ CRITICAL FIX: Filter out applications with null populated fields
    const validApplications = applications.filter(app => {
      if (!app.userId || !app.jobId) {
        console.log(`❌ Invalid application found: ${app._id}`, {
          userId: app.userId,
          jobId: app.jobId
        });
        return false;
      }
      return true;
    });

    console.log(`✅ Found ${applications.length} total applications, ${validApplications.length} valid`);

    return res.json({ success: true, applications: validApplications });
  } catch (error) {
    console.error("❌ getCompanyJobApplicants Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// get company posted jobs
export const getCompanyPostedJobs = async (req, res) => {
    try {
        const companyId = req.company._id

        const jobs = await Job.find({ companyId });

        const jobsData = await Promise.all(jobs.map(async (job)=>{
            const applicants = await JobApplication.find({jobId: job._id})
            return {...job.toObject(),applicants:applicants.length}
        }))



        res.json({success:true,jobsData})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
};

// change job application stattus

export const ChangeJobApplicationStatus = async (req, res) => {
    try {
      const {id,status} =req.body
    // find job apllication and update status
    await JobApplication.findOneAndUpdate({_id:id},{status})

    res.json({success:true ,  message :'status changed'})


    } catch (error) {
      res.json({success:false,message : error.message})
    }
};

// change job visibility
export const changeVisibility = async (req, res) => {
    try {
        const {id} = req.body

        const companyId = req.company._id

        const job = await Job.findById(id)

        if(companyId.toString()=== job.companyId.toString()){

            job.visible = !job.visible


        }

        await job.save()

        res.json({success:true,job})
    } catch (error ) {
        res.json({success:false,message:error.message})
        
    }

};
