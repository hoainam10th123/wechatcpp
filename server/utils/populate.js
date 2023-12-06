import mongoose from "mongoose";
import jobModel from "../models/jobModel.js";
import userModel from "../models/userModel.js";
import { readFile } from 'fs/promises'

//cmd: node populate.js to seed data


try {
    const url = 'mongodb+srv://hoainam10th:UzH90C1X90Aq255c@cluster0.uijfwkt.mongodb.net/jobsdb?retryWrites=true&w=majority'
    await mongoose.connect(url)
    const user = userModel.findOne({email: 'hoainam10th@gmail.com'})
    const jsonJob = JSON.parse(await readFile(new URL('./mockData.json', import.meta.url)))
    const jobs = jsonJob.map(job => {
        return {...job, createdBy: user._id}
    })
    await jobModel.deleteMany({createdBy: user._id})
    await jobModel.create(jobs)
    console.log('Success')
    process.exit(0)
} catch (error) {
    console.error(error)
    process.exit(1)
}