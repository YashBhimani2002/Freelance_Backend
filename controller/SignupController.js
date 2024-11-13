const clientModel = require("../model/ClientModel");
const Education = require("../model/Education_tblModel");
const Experience = require("../model/Experience_tblModel");
const Professional = require("../model/Professional");
const CategoriesProfessional = require("../model/Category_professionalModel");
const SkillProfessional = require("../model/Skill_professionalModel");
const moment = require('moment');
const User = require("../model/userModel");
async function getAllProductsClient(req, res) {

    const {user_id} = req.body
    const {
        company_name,
        company_desc,
        location,
        company_city,
        company_country,
        company_state,
        phone,
        designation,
    } = req.body;
    const id = user_id.toString();
    const data = {
        user_id: user_id,
        company_name,
        company_desc,
        location,
        city_id: company_city,
        country_id: company_country,
        state_id: company_state,
        phone,
        designation,
        profile_img: null,
    };

    try {
        // Check if the user already exists
        const existingUser = await clientModel.findOne({ "user_id": user_id });
        if (existingUser) {
            // Update existing user
            await clientModel.updateOne({ "user_id": user_id }, data);
        } else {
            // Create new user
            await clientModel.create(data);
        }
        // Create Provider_tbl entry
        if (req.file) {
        }

        // Update user profile
        const clientData = {
            client_profile_complete: 0,
            status: 1,
            login_as: 1,
        };
        await User.updateOne({ _id: user_id }, clientData);
        res.status(200).send('User profile updated successfully.');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function get_all_education_data_registration(req, res) {
    const {
        user_id,
        school,
        degree,
        study,
        attendedstartdate,
        attendedenddate,
    } = req.body;



    const fromDate = moment(attendedstartdate, ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'], true);
    const toDate = moment(attendedenddate, ['YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'], true);


    if (!fromDate.isValid() || !toDate.isValid()) {
        return res.status(400).json({ error: 'Invalid date format' });
    }

    const educationData = {
        user_id: user_id,
        school,
        degree,
        study,
        from_date: fromDate.format('YYYY-MM-DD'), // Format as 'YYYY-MM-DD'
        to_date: toDate.format('YYYY-MM-DD'),     // Format as 'YYYY-MM-DD'
    };

    const existingUser = await Education.findOne({ user_id: user_id });

    if (existingUser) {
        // Update existing user
        await Education.updateOne({ user_id: user_id }, educationData);
        res.status(200).send('User profile updated successfully.');
    } else {
        // Create new user
        await Education.create(educationData);
        res.status(200).send('User profile created successfully.');
    }
}


async function get_all_experience_data_registration(req, res) {
    const {
        user_id,
        exp_title,
        company,
        city_id,
        state_id,
        address,
        country_id,
        month,
        year,
        end_month,
        end_year,
        check,
    } = req.body;

    const data = {
        user_id: user_id,
        exp_title,
        company,
        city_id,
        state_id,
        address,
        country_id,
        month,
        year,
        end_month,
        end_year,
        check,
    };

    const existingUser = await Experience.findOne({ user_id: user_id });

    if (existingUser) {
        await Experience.updateOne({ user_id: user_id }, data);
        res.status(200).send('User profile updated successfully.');
    } else {
        // Create new user
        await Experience.create(data);
        res.status(200).send('User profile created successfully.');
    }
}
async function signupFormSubmit(req, res) {
    try {
        const {
            user_id,
            bio_title,
            bio_brief,
            company,
            phone,
            location,
            city_id,
            country_id,
            state_id,
            job_category,
            experience_level,
        } = req.body;
        let data = {
            user_id,
            bio_title,
            bio_brief,
            company,
            phone,
            location,
            city_id,
            country_id,
            state_id,
            job_category,
            experience_level,
        };

        if (req.file) {
            const imageName = req.file.originalname;
            data = { ...data, profile_img: imageName };
        }

        const existingProvider = await Professional.findOne({ user_id: user_id });

        if (existingProvider) {
            // Update existing Professional document
            await Professional.updateOne({ user_id: user_id }, { $set: data });
        } else {
            // Create a new Professional document
            const newProvider = await Professional.create(data);
            const extPrvdId = newProvider._id; // Assuming "_id" is the identifier in MongoDB

            // Create or update CategoriesProfessional document
            await CategoriesProfessional.findOneAndUpdate(
                { professionalId: extPrvdId },
                { $set: { categoryId: req.body.job_category } },
                { upsert: true }
            );

            // Create or update SkillProfessional document
            await SkillProfessional.findOneAndUpdate(
                { professional_id: extPrvdId },
                { $set: { skill_id: req.body.skills } },
                { upsert: true }
            );
        }

        // Respond to the client
        const clientData = {
            professional_profile_complete: 0,
            status: 1,
        };
        await User.updateOne({ _id: user_id }, clientData);
        res.status(200).send({ success: true, message: 'Signup successful' });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllProductsClient,
    get_all_education_data_registration,
    get_all_experience_data_registration,
    signupFormSubmit
};